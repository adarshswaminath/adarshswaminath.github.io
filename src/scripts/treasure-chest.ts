const CLOSED_SRC = '/trussure-chest.png'
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
 * Field-notebook treasure chest: click to open / close.
 * Idempotent; safe to call on astro:page-load.
 */
export function setupTreasureChest() {
  const roots = document.querySelectorAll<HTMLElement>('[data-treasure-chest]')

  roots.forEach((root) => {
    if (root.dataset.treasureBound === 'true') return

    const cluster = root.querySelector<HTMLElement>('[data-treasure-cluster]')
    const trigger = root.querySelector<HTMLButtonElement>('[data-treasure-trigger]')
    const label = root.querySelector<HTMLElement>('[data-treasure-label]')
    const box = root.querySelector<HTMLElement>('[data-treasure-box]')
    const img = root.querySelector<HTMLImageElement>('[data-treasure-img]')

    if (!cluster || !trigger || !label || !box || !img) return

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

    const setOpened = (next: boolean) => {
      opened = next
      img.src = opened ? OPEN_SRC : CLOSED_SRC
      box.classList.toggle('is-open', opened)
      root.classList.toggle('is-open', opened)
      trigger.setAttribute('aria-expanded', opened ? 'true' : 'false')
      trigger.setAttribute(
        'aria-label',
        opened ? 'Close the treasure chest' : 'Open the treasure chest',
      )
      label.textContent = opened ? '[Close the chest!]' : '[Open the chest!]'
      box.setAttribute(
        'aria-label',
        opened ? 'Treasure chest, open' : 'Treasure chest, closed',
      )
    }

    const toggle = async () => {
      if (animating) return
      animating = true

      playUnlock()

      if (!prefersReducedMotion()) {
        box.classList.add('is-shaking')
        await wait(SHAKE_MS)
        box.classList.remove('is-shaking')
      }

      setOpened(!opened)
      animating = false
    }

    cluster.addEventListener('click', (event) => {
      event.preventDefault()
      void toggle()
    })
  })
}
