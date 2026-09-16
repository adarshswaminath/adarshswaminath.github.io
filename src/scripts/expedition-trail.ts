/**
 * Expedition Trail — cursor-following explorer for desktop.
 * The hiker tracks the pointer in 2D, walks with a JS-driven stride cycle,
 * and leaves a short fading footprint trail (max 4 prints).
 */

const LG_MIN = 1024
const SMOOTHING = 0.14
const ANGLE_SMOOTHING = 0.18
const IDLE_MS = 220
/** Half-stride distance before the next foot can plant */
const FOOTPRINT_STEP_DIST = 18
/** Max visible prints (alternating L/R) */
const FOOTPRINT_MAX = 4
const PAD = 28
/** Radians of walk-cycle advance per px of remaining distance */
const WALK_PHASE_PER_PX = 0.085
const WALK_SPEED_MIN = 0.45
/** Lateral offset from walking centerline (each track) */
const FOOT_OFFSET = 3.2
/** Explorer center → planted foot (along travel) */
const FOOT_BEHIND = 8
/** Alternating forward offset along the path (L/R zigzag) */
const FOOT_FORWARD_STAGGER = 3.5
const TOE_ANGLE_LEFT = -3.5
const TOE_ANGLE_RIGHT = 2.5
/** Render scale applied on top of path geometry */
const FOOTPRINT_BASE_SCALE = 1.12
const FOOTPRINT_PATH_SCALE = 1.22

let cleanup: (() => void) | null = null

function printVariation(seed: number) {
  const t = ((seed * 7919) % 1000) / 1000
  const u = ((seed * 6271) % 1000) / 1000
  return {
    scale: 0.97 + t * 0.04,
    rotJitter: (t - 0.5) * 1.8,
    jitterX: (u - 0.5) * 0.7,
    jitterY: (t - 0.5) * 0.7,
  }
}

/**
 * Single human foot impression (local −Y = toes, +Y = heel).
 * Reads like a tiny 👣 glyph: wide forefoot, pinched arch, round heel.
 */
function humanFootprintPath(side: 1 | -1): string {
  const s = FOOTPRINT_PATH_SCALE
  const o = (x: number, y: number) =>
    `${(x * side * s).toFixed(2)} ${(y * s).toFixed(2)}`
  const inn = (x: number, y: number) =>
    `${(-x * side * s).toFixed(2)} ${(y * s).toFixed(2)}`
  return [
    `M ${inn(0.18, -6.6)}`,
    `C ${inn(0.05, -7.25)} ${o(0.5, -7.45)} ${o(1.05, -6.85)}`,
    `C ${o(1.28, -5.75)} ${o(1.22, -4.05)} ${o(0.95, -3.05)}`,
    `C ${o(1.08, -1.55)} ${o(0.82, 0.15)} ${inn(0.2, 0.95)}`,
    `C ${inn(0.1, 2.65)} ${inn(0.14, 4.85)} ${o(0.48, 6.15)}`,
    `C ${o(0.18, 7.05)} ${inn(0.08, 6.95)} ${inn(0.16, 5.85)}`,
    `C ${inn(0.14, 3.85)} ${inn(0.1, 1.35)} ${inn(0.16, -1.15)}`,
    `C ${inn(0.2, -3.35)} ${inn(0.22, -5.35)} ${inn(0.18, -6.6)} Z`,
  ].join(' ')
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isDesktop(): boolean {
  return window.matchMedia(`(min-width: ${LG_MIN}px)`).matches
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

/**
 * Measure the in-flow content height without the absolute trail.
 * Reading document.scrollHeight while the trail has a tall height, then
 * writing that back onto the trail, creates a ResizeObserver feedback loop
 * (scrollbar ↔ width ↔ height) that makes the whole page vibrate in Chrome.
 */
function contentHeight(content: HTMLElement | null, root: HTMLElement) {
  const prev = root.style.height
  root.style.height = '0px'

  const measured = content
    ? Math.max(content.scrollHeight, content.offsetHeight)
    : Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      )

  root.style.height = prev
  return Math.max(1, measured)
}

export function setupExpeditionTrail() {
  cleanup?.()
  cleanup = null

  const root = document.getElementById('expedition-trail')
  const frame = document.getElementById('expedition-trail-frame')
  const svg = document.getElementById(
    'expedition-trail-svg',
  ) as SVGSVGElement | null
  const footprintsLayer = document.getElementById(
    'expedition-footprints',
  ) as SVGGElement | null
  const explorer = document.getElementById('expedition-explorer')

  if (!root || !frame || !svg || !footprintsLayer || !explorer) return

  // In-flow page content (sibling) — never measure document.scrollHeight
  const content =
    (document.querySelector(
      '[data-expedition-content]',
    ) as HTMLElement | null) ?? (root.nextElementSibling as HTMLElement | null)

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

  let lastPrintX = currentX
  let lastPrintY = currentY
  let lastPlantPhase = -1
  let printSeed = 0

  type Footprint = {
    el: SVGGElement
    removeTimer: number
  }
  const footprints: Footprint[] = []

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
    const nextHeight = contentHeight(content, root)
    const nextWidth = Math.max(320, frame.getBoundingClientRect().width || 1024)

    // Ignore sub-pixel / scrollbar noise that would re-trigger layout
    if (
      Math.abs(nextHeight - height) < 1 &&
      Math.abs(nextWidth - width) < 1 &&
      root.style.height === `${height}px`
    ) {
      return
    }

    height = nextHeight
    width = nextWidth
    root.style.height = `${height}px`
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

  const fadeOldestFootprint = () => {
    const oldest = footprints.shift()
    if (!oldest) return
    oldest.el.classList.remove('is-visible')
    oldest.el.classList.add('is-fading')
    window.clearTimeout(oldest.removeTimer)
    oldest.removeTimer = window.setTimeout(
      () => {
        oldest.el.remove()
      },
      reduced ? 0 : 450,
    )
    refreshFootprintOpacity()
  }

  const refreshFootprintOpacity = () => {
    const n = footprints.length
    footprints.forEach((fp, idx) => {
      const age = n - 1 - idx
      fp.el.classList.remove('is-age-0', 'is-age-1', 'is-age-2', 'is-age-3')
      fp.el.classList.add(`is-age-${Math.min(age, 3)}`)
    })
  }

  /** One alternating step on its own walking track (L / R zigzag). */
  const plantStep = (x: number, y: number, travelDeg: number, side: 1 | -1) => {
    const rad = (travelDeg * Math.PI) / 180
    const forwardX = Math.cos(rad)
    const forwardY = Math.sin(rad)
    const lateralX = -Math.sin(rad)
    const lateralY = Math.cos(rad)

    const varn = printVariation(printSeed++)
    const forwardAlong =
      side === -1 ? -FOOT_FORWARD_STAGGER : FOOT_FORWARD_STAGGER

    const footX =
      x -
      forwardX * FOOT_BEHIND +
      lateralX * side * FOOT_OFFSET +
      forwardX * forwardAlong +
      lateralX * varn.jitterX +
      forwardX * varn.jitterY * 0.3
    const footY =
      y -
      forwardY * FOOT_BEHIND +
      lateralY * side * FOOT_OFFSET +
      forwardY * forwardAlong +
      lateralY * varn.jitterX +
      forwardY * varn.jitterY * 0.3

    const toeOut = side === -1 ? TOE_ANGLE_LEFT : TOE_ANGLE_RIGHT
    const rot = travelDeg + 270 + toeOut + varn.rotJitter
    const scale = FOOTPRINT_BASE_SCALE * varn.scale

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('class', 'expedition-trail__footprint')
    g.setAttribute(
      'transform',
      `translate(${footX.toFixed(2)} ${footY.toFixed(2)}) rotate(${rot.toFixed(2)}) scale(${scale.toFixed(3)})`,
    )

    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    shape.setAttribute('class', 'footprint__shape')
    shape.setAttribute('d', humanFootprintPath(side))
    shape.setAttribute('fill', 'var(--ink)')
    shape.setAttribute('stroke', 'none')
    g.appendChild(shape)

    footprintsLayer.appendChild(g)

    const fp: Footprint = { el: g, removeTimer: 0 }
    footprints.push(fp)

    while (footprints.length > FOOTPRINT_MAX) {
      fadeOldestFootprint()
    }

    refreshFootprintOpacity()

    if (reduced) {
      g.classList.add('is-visible')
    } else {
      requestAnimationFrame(() => {
        g.classList.add('is-visible')
      })
    }
  }

  const maybePlantFootprint = (
    x: number,
    y: number,
    walking: boolean,
    travelDeg: number,
  ) => {
    if (!walking) return

    const stepBeat = Math.floor(walkPhase * 2)
    if (stepBeat === lastPlantPhase) return

    const dx = x - lastPrintX
    const dy = y - lastPrintY
    if (dx * dx + dy * dy < FOOTPRINT_STEP_DIST * FOOTPRINT_STEP_DIST) return

    lastPlantPhase = stepBeat
    const side: 1 | -1 = stepBeat === 0 ? -1 : 1
    plantStep(x, y, travelDeg, side)
    lastPrintX = x
    lastPrintY = y
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

  const applyFrame = (walking: boolean, travelDeg: number) => {
    explorer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentAngle.toFixed(2)}deg) scaleX(${facing})`
    applyWalkPose(walkPhase, walking)
    maybePlantFootprint(currentX, currentY, walking, travelDeg)
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

    const travelDeg = (Math.atan2(dy, dx) * 180) / Math.PI

    if (walking) {
      // Advance stride from travel distance this frame
      const step = Math.hypot(dx * SMOOTHING, dy * SMOOTHING)
      walkPhase = (walkPhase + step * WALK_PHASE_PER_PX) % 1

      const raw = (Math.atan2(dy, dx) * 180) / Math.PI
      const folded = raw > 90 || raw < -90 ? raw - Math.sign(raw) * 180 : raw
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
      lastPlantPhase = -1
      applyFrame(false, travelDeg)
      return
    }

    applyFrame(walking, travelDeg)
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
      applyFrame(false, 0)
      return
    }
    applyFrame(false, 0)
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
  // Observe the in-flow content only — never <html>, or scrollbar
  // toggles keep bouncing width/height and vibrating the page.
  if (content) ro?.observe(content)
  else
    ro?.observe(document.body)

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
  applyFrame(false, 0)

  cleanup = () => {
    disposed = true
    window.clearTimeout(idleTimer)
    if (resizeRaf) window.cancelAnimationFrame(resizeRaf)
    footprints.forEach((fp) => {
      window.clearTimeout(fp.removeTimer)
      fp.el.remove()
    })
    footprints.length = 0
    footprintsLayer.replaceChildren()
    mqDesktop.removeEventListener('change', onMq)
    mqMotion.removeEventListener('change', onMq)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', onResize)
    ro?.disconnect()
  }
}
