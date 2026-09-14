// Tracing beam scroll animation starts at #projects
export function setupTracingBeam() {
  const gradient = document.getElementById('tracing-gradient')
  const beamRoot = document.getElementById('tracing-beam')
  const beamRail = document.getElementById('tracing-beam-rail')
  const dotContainer = document.getElementById('tracing-beam-dot')
  const dotInner = document.getElementById('tracing-beam-inner-dot')
  const projects = document.getElementById('projects')

  if (!gradient || !beamRail) return

  let scrollY = window.scrollY
  let currentY1 = 0
  let targetY1 = 0
  let currentY2 = -25
  let targetY2 = -25
  let isAnimating = true

  const syncRailToProjects = () => {
    if (!projects || !beamRoot) {
      beamRail.style.top = '0px'
      return
    }

    const rect = projects.getBoundingClientRect()
    // Keep the rail starting at the projects section (or viewport top once passed)
    const top = Math.max(0, rect.top)
    beamRail.style.top = `${top}px`

    // Hide while the projects section is still fully below the fold
    const visible = rect.top < window.innerHeight - 40
    beamRoot.style.opacity = visible ? '1' : '0'
  }

  const updateScroll = () => {
    scrollY = window.scrollY
    syncRailToProjects()
    if (!isAnimating) {
      isAnimating = true
      requestAnimationFrame(animateParams)
    }
  }

  window.addEventListener('scroll', updateScroll, {
    passive: true,
  })
  window.addEventListener('resize', syncRailToProjects, {
    passive: true,
  })

  const animateParams = () => {
    const windowHeight = window.innerHeight
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    )
    const maxScroll = Math.max(0, documentHeight - windowHeight)

    // Progress relative to reaching #projects, not the hero
    const projectsTop = projects
      ? projects.getBoundingClientRect().top + scrollY
      : 0
    const startScroll = Math.max(0, projectsTop - windowHeight * 0.15)
    const range = Math.max(1, maxScroll - startScroll)
    let scrollPercent =
      maxScroll > 0 ? (scrollY - startScroll) / range : 0
    scrollPercent = Math.max(0, Math.min(1, scrollPercent))

    targetY1 = scrollPercent * 125
    targetY2 = targetY1 - 25

    const diff1 = targetY1 - currentY1
    const diff2 = targetY2 - currentY2
    currentY1 += diff1 * 0.08
    currentY2 += diff2 * 0.08

    gradient.setAttribute('y1', currentY1.toString())
    gradient.setAttribute('y2', currentY2.toString())

    if (scrollPercent > 0.02) {
      if (dotContainer) {
        dotContainer.style.boxShadow = 'none'
        dotContainer.style.borderColor = 'transparent'
      }
      if (dotInner) {
        dotInner.style.backgroundColor = '#174A91'
        dotInner.style.borderColor = '#174A91'
      }
    } else {
      if (dotContainer) {
        dotContainer.style.boxShadow = 'none'
        dotContainer.style.borderColor = ''
      }
      if (dotInner) {
        dotInner.style.backgroundColor = ''
        dotInner.style.borderColor = ''
      }
    }

    if (Math.abs(diff1) < 0.1 && Math.abs(diff2) < 0.1) {
      isAnimating = false
    } else {
      requestAnimationFrame(animateParams)
    }
  }

  syncRailToProjects()
  updateScroll()
  requestAnimationFrame(animateParams)
}
