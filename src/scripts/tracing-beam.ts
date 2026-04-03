// Tracing beam scroll animation
export function setupTracingBeam() {
  const gradient = document.getElementById('tracing-gradient');
  const dotContainer = document.getElementById('tracing-beam-dot');
  const dotInner = document.getElementById('tracing-beam-inner-dot');
  if (!gradient) return;

  let scrollY = window.scrollY;
  let currentY1 = 0;
  let targetY1 = 0;
  let currentY2 = -25;
  let targetY2 = -25;
  let isAnimating = true;

  const updateScroll = () => {
    scrollY = window.scrollY;
    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(animateParams);
    }
  };
  
  window.addEventListener('scroll', updateScroll, { passive: true });

  const animateParams = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const maxScroll = Math.max(0, documentHeight - windowHeight);
    
    let scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;
    scrollPercent = Math.max(0, Math.min(1, scrollPercent));

    targetY1 = scrollPercent * 125;
    targetY2 = targetY1 - 25;

    const diff1 = targetY1 - currentY1;
    const diff2 = targetY2 - currentY2;
    currentY1 += diff1 * 0.08;
    currentY2 += diff2 * 0.08;

    gradient.setAttribute('y1', currentY1.toString());
    gradient.setAttribute('y2', currentY2.toString());

    if (scrollY > 10) {
      if (dotContainer) {
        dotContainer.style.boxShadow = 'none';
        dotContainer.style.borderColor = 'transparent';
      }
      if (dotInner) {
        dotInner.style.backgroundColor = 'white';
        dotInner.style.borderColor = 'white';
      }
    } else {
      if (dotContainer) {
        dotContainer.style.boxShadow = 'rgba(0, 0, 0, 0.24) 0px 3px 8px';
        dotContainer.style.borderColor = 'rgba(0,0,0,0.24)';
      }
      if (dotInner) {
        dotInner.style.backgroundColor = '';
        dotInner.style.borderColor = '';
      }
    }

    if (Math.abs(diff1) < 0.1 && Math.abs(diff2) < 0.1) {
      isAnimating = false;
    } else {
      requestAnimationFrame(animateParams);
    }
  };

  updateScroll();
  requestAnimationFrame(animateParams);
}
