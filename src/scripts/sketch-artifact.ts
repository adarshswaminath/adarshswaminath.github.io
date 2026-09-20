import {
  getSketchArtifact,
  type SketchArtifactKey,
  type SketchArtifactPreset,
} from '../data/sketch-artifacts'

const SHAKE_MS = 300

const KNOWN_KEYS: Record<SketchArtifactKey, true> = {
  campfire: true,
  'treasure-chest': true,
  'monster-door': true,
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

type ActivateCtx = {
  root: HTMLElement
  box: HTMLElement
  active: boolean
}

/** Door only knocks the explorer down — never revives (needs a hard refresh). */
function runEffect(preset: SketchArtifactPreset, ctx: ActivateCtx) {
  if (preset.effect !== 'monster-door' || !ctx.active) return

  const rect = ctx.box.getBoundingClientRect()
  window.dispatchEvent(
    new CustomEvent('expedition:knockdown', {
      detail: {
        clientX: rect.left + rect.width * 0.55,
        clientY: rect.top + rect.height * 0.7,
      },
    }),
  )
}

function createAudio(preset: SketchArtifactPreset) {
  const audio = new Audio(preset.sound.src)
  audio.preload = 'auto'
  if (preset.sound.loop) audio.loop = true
  return audio
}

function playOnce(audio: HTMLAudioElement) {
  audio.pause()
  audio.currentTime = 0
  void audio.play().catch(() => {
    /* Autoplay policies / missing file — ignore */
  })
}

function stopAudio(audio: HTMLAudioElement) {
  audio.pause()
  audio.currentTime = 0
}

/**
 * Shared setup for gutter sketch artifacts (campfire, chest, door).
 * Idempotent; safe to call on astro:page-load.
 */
export function setupSketchArtifacts() {
  const roots = document.querySelectorAll<HTMLElement>('[data-sketch-artifact]')

  roots.forEach((root) => {
    if (root.dataset.sketchBound === 'true') return

    const key = root.dataset.sketchArtifact as SketchArtifactKey | undefined
    if (!key || !KNOWN_KEYS[key]) return

    const preset = getSketchArtifact(key)
    const cluster = root.querySelector<HTMLElement>('[data-sketch-cluster]')
    const trigger = root.querySelector<HTMLButtonElement>(
      '[data-sketch-trigger]',
    )
    const label = root.querySelector<HTMLElement>('[data-sketch-label]')
    const box = root.querySelector<HTMLElement>('[data-sketch-box]')
    const img = root.querySelector<HTMLImageElement>('[data-sketch-img]')

    if (!cluster || !trigger || !label || !box) return
    if (preset.images && !img) return

    root.dataset.sketchBound = 'true'

    let active = false
    let spent = false
    let animating = false
    let audio: HTMLAudioElement | null = null

    const ensureAudio = () => {
      if (!audio) audio = createAudio(preset)
      return audio
    }

    const applySound = (next: boolean) => {
      const a = ensureAudio()
      const { mode } = preset.sound

      if (mode === 'active-loop') {
        if (next) playOnce(a)
        else stopAudio(a)
        return
      }

      if (mode === 'toggle') {
        playOnce(a)
        return
      }

      if (mode === 'activate' && next) {
        playOnce(a)
      }
    }

    const applyUi = (next: boolean, options?: { spent?: boolean }) => {
      active = next
      const isSpent = options?.spent ?? spent

      root.classList.toggle(preset.activeClass, active)
      box.classList.toggle(preset.activeClass, active)

      if (preset.images && img) {
        img.src = active ? preset.images.on : preset.images.off
      }

      if (preset.toggleAttr === 'pressed') {
        trigger.setAttribute('aria-pressed', active ? 'true' : 'false')
      } else {
        trigger.setAttribute('aria-expanded', active ? 'true' : 'false')
      }

      if (isSpent && !active) {
        trigger.setAttribute(
          'aria-label',
          preset.aria.triggerSpent ?? preset.aria.triggerOff,
        )
        label.textContent = preset.labels.spent ?? preset.labels.off
        box.setAttribute(
          'aria-label',
          preset.aria.boxSpent ?? preset.aria.boxOff,
        )
        trigger.disabled = true
        trigger.style.cursor = 'default'
        return
      }

      trigger.setAttribute(
        'aria-label',
        active ? preset.aria.triggerOn : preset.aria.triggerOff,
      )
      label.textContent = active ? preset.labels.on : preset.labels.off
      box.setAttribute(
        'aria-label',
        active ? preset.aria.boxOn : preset.aria.boxOff,
      )
    }

    const toggle = async () => {
      if (animating || spent) return
      animating = true

      const next = !active

      // One-shot artifacts only activate, never toggle off by click
      if (preset.once && !next) {
        animating = false
        return
      }

      if (preset.images?.shake && !prefersReducedMotion()) {
        box.classList.add('is-shaking')
        await wait(SHAKE_MS)
        box.classList.remove('is-shaking')
      }

      // Open/close visual first, then sound + effect so scatter matches the door
      applyUi(next)
      applySound(next)
      runEffect(preset, { root, box, active: next })

      if (preset.once && next) {
        spent = true
        const closeMs = preset.autoCloseMs ?? 1200
        await wait(closeMs)
        // Close door visually only — explorer stays scattered until refresh
        applyUi(false, { spent: true })
      }

      animating = false
    }

    cluster.addEventListener('click', (event) => {
      event.preventDefault()
      void toggle()
    })
  })
}
