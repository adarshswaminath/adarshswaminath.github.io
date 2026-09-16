const OPEN_SRC = '/trussure-chest-open.png'
const SOUND_SRC = '/unlock.mp3'
const SHAKE_MS = 300

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/**
 * Field-notebook treasure chest: click the note or chest to open.
 * Idempotent; safe to call on astro:page-load.
 */
export function setupTreasureChest() {
  const roots = document.querySelectorAll<HTMLElement>('[data-treasure-chest]')

  roots.forEach((root) => {
    if (root.dataset.treasureBound === 'true') return

    const cluster = root.querySelector<HTMLElement>('[data-treasure-cluster]')
    const trigger = root.querySelector<HTMLButtonElement>('[data-treasure-trigger]')
    const hint = root.querySelector<HTMLElement>('[data-treasure-hint]')
    const box = root.querySelector<HTMLElement>('[data-treasure-box]')
    const img = root.querySelector<HTMLImageElement>('[data-treasure-img]')

    if (!cluster || !trigger || !hint || !box || !img) return

    root.dataset.treasureBound = 'true'

    let opened = false
    let animating = false
    let audio: HTMLAudioElement | null = null

    const playUnlock = () => {
      if (!audio) {
        audio = new Audio(SOUND_SRC)
        audio.preload = 'auto'
      }
      audio.pause()
      audio.currentTime = 0
      void audio.play().catch(() => {
        /* Autoplay policies / missing file — ignore */
      })
    }

    const markOpened = () => {
      img.src = OPEN_SRC
      box.classList.add('is-open')
      hint.classList.add('is-hidden')
      hint.setAttribute('aria-hidden', 'true')
      root.classList.add('is-discovered')
      trigger.setAttribute('aria-expanded', 'true')
      trigger.setAttribute('aria-label', 'Field note discovered')
      trigger.disabled = true
      trigger.tabIndex = -1
      opened = true
    }

    const open = async () => {
      if (opened || animating) return
      animating = true

      playUnlock()

      if (!prefersReducedMotion()) {
        box.classList.add('is-shaking')
        await wait(SHAKE_MS)
        box.classList.remove('is-shaking')
      }

      markOpened()
      animating = false
    }

    // Text button, chest, or arrow — any click in the cluster opens it
    cluster.addEventListener('click', (event) => {
      event.preventDefault()
      void open()
    })
  })
}
