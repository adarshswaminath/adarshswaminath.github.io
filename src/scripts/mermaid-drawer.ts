let mermaidPromise: Promise<typeof import('mermaid').default> | null = null;

function loadMermaid() {
  mermaidPromise ??= import('mermaid').then((mod) => {
    const mermaid = mod.default;
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      flowchart: { htmlLabels: true, curve: 'basis' },
    });
    return mermaid;
  });
  return mermaidPromise;
}

async function attachPanzoom(mermaidEl: HTMLElement) {
  const viewport = mermaidEl.closest<HTMLElement>('.architecture-mermaid');
  if (!viewport || viewport.dataset.panzoomAttached === 'true') return;

  const Panzoom = (await import('@panzoom/panzoom')).default;
  const panzoom = Panzoom(mermaidEl, {
    canvas: true,
    maxScale: 5,
    minScale: 0.2,
    step: 0.15,
    duration: 200,
    easing: 'ease-out',
  });

  const onWheel = (e: WheelEvent) => {
    panzoom.zoomWithWheel(e);
  };
  viewport.addEventListener('wheel', onWheel, { passive: false });

  viewport.dataset.panzoomAttached = 'true';
}

/** Renders the architecture diagram inside the visible project drawer panel. */
export async function renderMermaidInVisibleDrawer() {
  const mermaid = await loadMermaid();
  const root = document.querySelector('.drawer-content:not(.hidden)');
  if (!root) return;
  const el = root.querySelector<HTMLElement>('.mermaid');
  if (!el || el.dataset.mermaidDone === 'true') return;
  try {
    await mermaid.run({ nodes: [el] });
    el.dataset.mermaidDone = 'true';
    await attachPanzoom(el);
  } catch (err) {
    console.error('Mermaid render failed', err);
  }
}
