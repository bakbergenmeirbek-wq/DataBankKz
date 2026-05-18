/* IntersectionObserver, counters, hero particles */
(function () {
  function initFadeIn() {
    const els = document.querySelectorAll('.fade-in');
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => obs.observe(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 2000;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !e.target.dataset.done) {
            e.target.dataset.done = '1';
            animateCounter(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    counters.forEach((c) => obs.observe(c));
  }

  function initHeroParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    const particles = [];
    const count = 80;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        a: Math.random() * 0.5 + 0.2
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 142, 247, ${p.a})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
  }

  function initDataPanel() {
    const panel = document.getElementById('data-panel');
    if (!panel) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            panel.querySelector('.animated-bars')?.classList.add('animate');
            panel.querySelector('.data-flow-line')?.classList.add('animate');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(panel);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFadeIn();
    initCounters();
    initHeroParticles();
    initDataPanel();
  });
})();
