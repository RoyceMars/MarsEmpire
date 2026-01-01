(function () {
  // Respect touch + reduced motion
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouch) return;

  if (document.querySelector('meta[name="no-cursor-dot"]')) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let curX = targetX;
  let curY = targetY;

  // smooth follow
  const stiffness = 0.18;
  const threshold = 0.1;

  function raf() {
    const dx = targetX - curX;
    const dy = targetY - curY;
    curX += dx * stiffness;
    curY += dy * stiffness;

    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      dot.style.left = curX + 'px';
      dot.style.top  = curY + 'px';
    } else {
      dot.style.left = targetX + 'px';
      dot.style.top  = targetY + 'px';
    }
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // show on first move
  let shown = false;
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!shown) {
      dot.style.transition = 'opacity 150ms ease';
      dot.style.opacity = '1';
      shown = true;
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => { dot.style.opacity = '0'; }, { passive: true });
  window.addEventListener('mouseenter', () => { dot.style.opacity = '1'; }, { passive: true });

  function isInteractive(el) {
    return el && el.closest('a, button, [role="button"], input, textarea, select, summary');
  }

  let hoverCount = 0;
  document.addEventListener('mouseover', (e) => {
    if (isInteractive(e.target)) {
      hoverCount++;
      dot.classList.add('is-hover');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (isInteractive(e.target)) {
      hoverCount = Math.max(0, hoverCount - 1);
      if (hoverCount === 0) dot.classList.remove('is-hover');
    }
  }, { passive: true });

  document.addEventListener('mousedown', () => dot.classList.add('is-down'));
  document.addEventListener('mouseup',   () => dot.classList.remove('is-down'));

  // keep z-index on top
  const maxZ = 2147483647;
  function bumpZ() { dot.style.zIndex = String(maxZ); }
  document.addEventListener('scroll', bumpZ, { passive: true });
  window.addEventListener('focus', bumpZ);
  bumpZ();
})();
