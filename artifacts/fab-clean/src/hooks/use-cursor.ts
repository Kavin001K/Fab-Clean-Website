import { useEffect } from "react";

export function useSteamCursor() {
  useEffect(() => {
    // Disable entirely on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // ── Elements ──────────────────────────────────────────
    const ring = document.getElementById("fc-cursor-ring")!;
    const dot = document.getElementById("fc-cursor-dot")!;
    if (!ring || !dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf: number;
    let isHovering = false;
    let isDown = false;

    // ── Particle pool ─────────────────────────────────────
    const PARTICLE_COUNT = 6;
    const particles: HTMLElement[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement("div");
      p.className = "fc-steam-particle";
      document.body.appendChild(p);
      particles.push(p);
    }

    let particleIndex = 0;
    let lastSpawnX = 0;
    let lastSpawnY = 0;
    let frameCount = 0;

    function spawnParticle(x: number, y: number, hover: boolean) {
      const p = particles[particleIndex % PARTICLE_COUNT];
      particleIndex++;

      // Random drift values baked in as CSS custom properties
      const driftX = (Math.random() - 0.5) * 28;
      const size = hover ? 5 + Math.random() * 5 : 3 + Math.random() * 4;
      const dur = 600 + Math.random() * 400;

      p.style.cssText = `
        left: ${x}px;
        top:  ${y}px;
        width: ${size}px;
        height: ${size}px;
        --drift-x: ${driftX}px;
        animation: none;
        opacity: 1;
        background: ${
          hover
            ? "radial-gradient(circle, #F4B942, #E8A020)"
            : "radial-gradient(circle, #a8d85a, #8DC63F)"
        };
        box-shadow: 0 0 ${size * 2}px ${hover ? "#F4B94266" : "#8DC63F55"};
      `;

      // Force reflow so animation restarts
      void p.offsetWidth;

      p.style.animation = `fc-steam-rise ${dur}ms ease-out forwards`;
    }

    // ── Mouse tracking ────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Spawn particle every 3 frames and only if cursor moved enough
      const dx = mouseX - lastSpawnX;
      const dy = mouseY - lastSpawnY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 8) {
        spawnParticle(mouseX, mouseY, isHovering);
        lastSpawnX = mouseX;
        lastSpawnY = mouseY;
      }
    }

    function onMouseDown() {
      isDown = true;
      ring.classList.add("fc-cursor-click");
      dot.classList.add("fc-cursor-click");
      // Burst of particles on click
      for (let i = 0; i < 4; i++) {
        setTimeout(() => spawnParticle(mouseX, mouseY, isHovering), i * 30);
      }
    }

    function onMouseUp() {
      isDown = false;
      ring.classList.remove("fc-cursor-click");
      dot.classList.remove("fc-cursor-click");
    }

    function onMouseEnter() {
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    }

    function onMouseLeave() {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    }

    // ── Hover state on interactive elements ───────────────
    function setHoverListeners() {
      const targets = document.querySelectorAll(
        "a, button, [role='button'], input, label, select, textarea, [data-cursor='pointer']"
      );
      targets.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          isHovering = true;
          ring.classList.add("fc-cursor-hover");
          dot.classList.add("fc-cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
          isHovering = false;
          ring.classList.remove("fc-cursor-hover");
          dot.classList.remove("fc-cursor-hover");
        });
      });
    }

    // Call once now, re-call after any route change via MutationObserver
    setHoverListeners();
    const mo = new MutationObserver(setHoverListeners);
    mo.observe(document.body, { childList: true, subtree: true });

    // ── Spring animation loop ─────────────────────────────
    const STIFFNESS = 0.13; // lower = more lag / floatier feel

    function loop() {
      frameCount++;

      // Spring interpolation for the ring (lags behind mouse)
      ringX += (mouseX - ringX) * STIFFNESS;
      ringY += (mouseY - ringY) * STIFFNESS;

      // Dot snaps directly to mouse (no lag)
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    // ── Events ────────────────────────────────────────────
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    // Hide native cursor globally
    document.body.style.cursor = "none";

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.body.style.cursor = "";
      particles.forEach((p) => p.remove());
    };
  }, []);
}
