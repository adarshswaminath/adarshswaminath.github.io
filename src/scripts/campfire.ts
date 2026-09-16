const SOUND_SRC = '/campfire.mp3'

/**
 * Expedition campfire: click the note or fire to light / douse.
 * Sound loops while lit. Idempotent; safe to call on astro:page-load.
 */
export function setupCampfire() {
  const roots = document.querySelectorAll<HTMLElement>('[data-campfire]')

  roots.forEach((root) => {
    if (root.dataset.campfireBound === 'true') return

    const cluster = root.querySelector<HTMLElement>('[data-campfire-cluster]')
    const trigger = root.querySelector<HTMLButtonElement>(
      '[data-campfire-trigger]',
    )
    const label = root.querySelector<HTMLElement>('[data-campfire-label]')
    const box = root.querySelector<HTMLElement>('[data-campfire-box]')

    if (!cluster || !trigger || !label || !box) return

    root.dataset.campfireBound = 'true'

    let lit = false
    let audio: HTMLAudioElement | null = null

    const ensureAudio = () => {
      if (!audio) {
        audio = new Audio(SOUND_SRC)
        audio.preload = 'auto'
        audio.loop = true
      }
      return audio
    }

    const playFire = () => {
      const a = ensureAudio()
      a.currentTime = 0
      void a.play().catch(() => {
        /* Autoplay policies / missing file — ignore */
      })
    }

    const stopFire = () => {
      if (!audio) return
      audio.pause()
      audio.currentTime = 0
    }

    const setLit = (next: boolean) => {
      lit = next
      root.classList.toggle('is-lit', lit)
      trigger.setAttribute('aria-pressed', lit ? 'true' : 'false')
      trigger.setAttribute(
        'aria-label',
        lit ? 'Douse the campfire' : 'Light the campfire',
      )
      label.textContent = lit ? '[douse the fire]' : '[light the campfire]'
      box.setAttribute(
        'aria-label',
        lit ? 'Campfire, burning' : 'Campfire, currently out',
      )

      if (lit) playFire()
      else stopFire()
    }

    const toggle = () => {
      setLit(!lit)
    }

    cluster.addEventListener('click', (event) => {
      event.preventDefault()
      toggle()
    })
  })
}
