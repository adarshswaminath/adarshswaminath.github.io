/**
 * Expedition Trail — cursor-following explorer for desktop.
 * The hiker tracks the pointer in 2D, walks with a JS-driven stride cycle,
 * and leaves a dotted ink trail behind.
 */

const LG_MIN = 1024
const SMOOTHING = 0.14
const ANGLE_SMOOTHING = 0.18
const IDLE_MS = 220
const TRAIL_MIN_DIST = 10
const TRAIL_MAX_POINTS = 220
const PAD = 28
/** Radians of walk-cycle advance per px of remaining distance */
const WALK_PHASE_PER_PX = 0.085
const WALK_SPEED_MIN = 0.45

let cleanup: (() => void) | null = null

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isDesktop(): boolean {
  return window.matchMedia(`(min-width: ${LG_MIN}px)`).matches
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

function documentHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  )
}

function buildTrailPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const mx = (prev.x + curr.x) / 2
    const my = (prev.y + curr.y) / 2
    d += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`
  }
  const last = points[points.length - 1]
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`
  return d
}

export function setupExpeditionTrail() {
  cleanup?.()
  cleanup = null

  const root = document.getElementById('expedition-trail')
  const frame = document.getElementById('expedition-trail-frame')
  const svg = document.getElementById(
    'expedition-trail-svg',
  ) as SVGSVGElement | null
  const route = document.getElementById(
    'expedition-route',
  ) as SVGPathElement | null
  const explorer = document.getElementById('expedition-explorer')

  if (!root || !frame || !svg || !route || !explorer) return

  const limb = {
    legL: explorer.querySelector<SVGGElement>('.hiker__leg--left'),
    legR: explorer.querySelector<SVGGElement>('.hiker__leg--right'),
    armL: explorer.querySelector<SVGPathElement>('.hiker__arm--left'),
    armR: explorer.querySelector<SVGPathElement>('.hiker__arm--right'),
    pack: explorer.querySelector<SVGPathElement>('.hiker__backpack'),
    body: explorer.querySelector<SVGPathElement>('.hiker__body'),
    pole: explorer.querySelector<SVGPathElement>('.hiker__pole'),
    hiker: explorer.querySelector<SVGGElement>('.hiker'),
  }

  let reduced = prefersReducedMotion()
  let disposed = false
  let isAnimating = false
  let isMoving = false
  let idleTimer = 0
  let facing = 1
  let walkPhase = 0

  let width = 1024
  let height = 1000

  let currentX = width * 0.82
  let currentY = Math.min(180, height * 0.15)
  let targetX = currentX
  let targetY = currentY
  let currentAngle = 0
  let targetAngle = 0

  const trail: { x: number; y: number }[] = [{ x: currentX, y: currentY }]

  type Checkpoint = {
    el: Element
    flag: Element | null
    y: number
    planted: boolean
  }
  let checkpoints: Checkpoint[] = []

  const refreshCheckpoints = () => {
    const frameTop = frame.getBoundingClientRect().top + window.scrollY
    checkpoints = Array.from(
      document.querySelectorAll('[data-expedition-checkpoint]'),
    ).map((el) => {
      const flag = el.querySelector('[data-expedition-flag]')
      const rect = el.getBoundingClientRect()
      const y = rect.top + window.scrollY - frameTop
      const planted = flag?.classList.contains('is-planted') ?? false
      return { el, flag, y, planted }
    })
  }

  const updateFlags = () => {
    if (!isDesktop()) return
    for (const cp of checkpoints) {
      if (cp.planted || !cp.flag) continue
      // Plant when the explorer reaches this divider / section boundary
      if (currentY >= cp.y - 12) {
        cp.planted = true
        cp.flag.classList.add('is-planted')
      }
    }
  }

  const syncSize = () => {
    height = documentHeight()
    root.style.height = `${height}px`
    width = Math.max(320, frame.getBoundingClientRect().width || 1024)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    currentX = clamp(currentX, PAD, width - PAD)
    currentY = clamp(currentY, PAD, height - PAD)
    targetX = clamp(targetX, PAD, width - PAD)
    targetY = clamp(targetY, PAD, height - PAD)
    refreshCheckpoints()
  }

  const clientToFrame = (clientX: number, clientY: number) => {
    const rect = frame.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return null

    const x = ((clientX - rect.left) / rect.width) * width
    const y = clientY - rect.top
    return { x, y }
  }

  const pushTrail = (x: number, y: number) => {
    const last = trail[trail.length - 1]
    const dx = x - last.x
    const dy = y - last.y
    if (dx * dx + dy * dy < TRAIL_MIN_DIST * TRAIL_MIN_DIST) return
    trail.push({ x, y })
    if (trail.length > TRAIL_MAX_POINTS) {
      trail.splice(0, trail.length - TRAIL_MAX_POINTS)
    }
    route.setAttribute('d', buildTrailPath(trail))
  }

  /** Apply a natural opposite-limb hiking pose from walkPhase (0–1). */
  const applyWalkPose = (phase: number, active: boolean) => {
    if (!active || reduced) {
      limb.legL?.style.removeProperty('transform')
      limb.legR?.style.removeProperty('transform')
      limb.armL?.style.removeProperty('transform')
      limb.armR?.style.removeProperty('transform')
      limb.pack?.style.removeProperty('transform')
      limb.body?.style.removeProperty('transform')
      limb.pole?.style.removeProperty('transform')
      limb.hiker?.style.removeProperty('transform')
      explorer.classList.remove('is-walking')
      return
    }

    explorer.classList.add('is-walking')

    const swing = Math.sin(phase * Math.PI * 2)
    const swingB = Math.sin(phase * Math.PI * 2 + Math.PI) // opposite
    const bob = Math.abs(Math.sin(phase * Math.PI * 2)) * 0.7

    const legAmp = 13
    const armAmp = 9

    if (limb.legL) {
      limb.legL.style.transform = `rotate(${(swing * legAmp).toFixed(2)}deg)`
    }
    if (limb.legR) {
      limb.legR.style.transform = `rotate(${(swingB * legAmp).toFixed(2)}deg)`
    }
    if (limb.armL) {
      limb.armL.style.transform = `rotate(${(swingB * armAmp).toFixed(2)}deg)`
    }
    if (limb.armR) {
      limb.armR.style.transform = `rotate(${(swing * armAmp).toFixed(2)}deg)`
    }
    if (limb.pack) {
      limb.pack.style.transform = `rotate(${(swing * 1.4).toFixed(2)}deg) translate(0, ${(bob * 0.25).toFixed(2)}px)`
    }
    if (limb.body) {
      limb.body.style.transform = `rotate(${(swing * 0.9).toFixed(2)}deg)`
    }
    if (limb.pole) {
      limb.pole.style.transform = `rotate(${(swing * 4).toFixed(2)}deg)`
    }
    if (limb.hiker) {
      limb.hiker.style.transform = `translateY(${(-bob).toFixed(2)}px)`
    }
  }

  const applyFrame = (walking: boolean) => {
    explorer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentAngle.toFixed(2)}deg) scaleX(${facing})`
    applyWalkPose(walkPhase, walking)
    pushTrail(currentX, currentY)
    updateFlags()
  }

  const tick = () => {
    if (disposed) return

    const dx = targetX - currentX
    const dy = targetY - currentY
    currentX += dx * SMOOTHING
    currentY += dy * SMOOTHING

    const speed = Math.hypot(dx, dy)
    const walking = speed > WALK_SPEED_MIN && !reduced

    if (walking) {
      // Advance stride from travel distance this frame
      const step = Math.hypot(dx * SMOOTHING, dy * SMOOTHING)
      walkPhase = (walkPhase + step * WALK_PHASE_PER_PX) % 1

      const raw = (Math.atan2(dy, dx) * 180) / Math.PI
      const folded =
        raw > 90 || raw < -90 ? raw - Math.sign(raw) * 180 : raw
      targetAngle = clamp(folded, -16, 16) * 0.35
      if (Math.abs(dx) > 0.4) {
        facing = dx >= 0 ? 1 : -1
      }
    } else {
      targetAngle = 0
    }

    currentAngle += (targetAngle - currentAngle) * ANGLE_SMOOTHING

    if (speed < 0.35) {
      currentX = targetX
      currentY = targetY
      isAnimating = false
      applyFrame(false)
      return
    }

    applyFrame(walking)
    requestAnimationFrame(tick)
  }

  const requestTick = () => {
    if (isAnimating || reduced || !isDesktop()) return
    isAnimating = true
    requestAnimationFrame(tick)
  }

  const markMoving = () => {
    isMoving = true
    window.clearTimeout(idleTimer)
    idleTimer = window.setTimeout(() => {
      isMoving = false
    }, IDLE_MS)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!isDesktop() || reduced) return

    const local = clientToFrame(event.clientX, event.clientY)
    if (!local) return

    if (local.x < -80 || local.x > width + 80) return

    targetX = clamp(local.x, PAD, width - PAD)
    targetY = clamp(local.y, PAD, height - PAD)
    markMoving()
    requestTick()
  }

  const onResize = () => {
    reduced = prefersReducedMotion()
    if (!isDesktop()) {
      root.style.height = '0px'
      return
    }
    syncSize()
    if (reduced) {
      applyFrame(false)
      return
    }
    applyFrame(false)
    if (isMoving) requestTick()
  }

  const mqDesktop = window.matchMedia(`(min-width: ${LG_MIN}px)`)
  const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const onMq = () => onResize()

  mqDesktop.addEventListener('change', onMq)
  mqMotion.addEventListener('change', onMq)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })

  let resizeRaf = 0
  const ro =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          if (resizeRaf) return
          resizeRaf = window.requestAnimationFrame(() => {
            resizeRaf = 0
            onResize()
          })
        })
      : null
  ro?.observe(document.documentElement)

  // Ensure limb transforms pivot from the hip / shoulder
  ;[
    limb.legL,
    limb.legR,
    limb.armL,
    limb.armR,
    limb.pack,
    limb.body,
    limb.pole,
    limb.hiker,
  ].forEach((el) => {
    if (!el) return
    el.style.transformBox = 'fill-box'
    if (el === limb.hiker) {
      el.style.transformOrigin = '50% 100%'
    } else if (el === limb.pack) {
      el.style.transformOrigin = '80% 40%'
    } else if (el === limb.pole) {
      el.style.transformOrigin = '0% 0%'
    } else {
      el.style.transformOrigin = '50% 0%'
    }
  })

  onResize()
  route.setAttribute('d', buildTrailPath(trail))
  applyFrame(false)

  cleanup = () => {
    disposed = true
    window.clearTimeout(idleTimer)
    if (resizeRaf) window.cancelAnimationFrame(resizeRaf)
    mqDesktop.removeEventListener('change', onMq)
    mqMotion.removeEventListener('change', onMq)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', onResize)
    ro?.disconnect()
  }
}
