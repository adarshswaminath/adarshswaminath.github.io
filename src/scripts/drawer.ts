import { renderMermaidInVisibleDrawer } from './mermaid-drawer'

// Project drawer open/close logic
export function setupDrawer() {
  const overlay = document.getElementById('project-drawer-overlay')
  const backdrop = document.getElementById('drawer-backdrop')
  const panel = document.getElementById('drawer-panel')
  const closeBtn = document.getElementById('drawer-close-btn')
  const contentBlocks = document.querySelectorAll('.drawer-content')
  const projectRows = document.querySelectorAll('.project-row')

  if (!overlay || !backdrop || !panel || !closeBtn) return

  const openDrawer = (index: number) => {
    // Show correct content block
    contentBlocks.forEach((block, i) => {
      ;(block as HTMLElement).classList.toggle('hidden', i !== index)
    })

    // Show overlay
    overlay.classList.remove('hidden')
    document.body.classList.add('drawer-open')

    // Reset animations
    panel.classList.remove('closing')
    backdrop.classList.remove('closing')

    requestAnimationFrame(() => {
      void renderMermaidInVisibleDrawer()
    })
  }

  const closeDrawer = () => {
    panel.classList.add('closing')
    backdrop.classList.add('closing')

    setTimeout(() => {
      overlay.classList.add('hidden')
      document.body.classList.remove('drawer-open')
      panel.classList.remove('closing')
      backdrop.classList.remove('closing')
    }, 250)
  }

  // Open on project row click
  projectRows.forEach((row) => {
    row.addEventListener('click', () => {
      const index = parseInt(row.getAttribute('data-project-index') || '0')
      openDrawer(index)
    })
  })

  // Close actions
  closeBtn.addEventListener('click', closeDrawer)
  backdrop.addEventListener('click', closeDrawer)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
      closeDrawer()
    }
  })
}
