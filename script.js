// ── SCROLL PROGRESS ──
  window.addEventListener('scroll', () => {
    const el = document.getElementById('scrollProgress');
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    el.style.width = pct + '%';
  });

  // ── STARFIELD CANVAS ──
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Stars
  const STAR_COUNT = 220;
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.6 + 0.2,
    alpha: Math.random() * 0.8 + 0.2,
    twinkleSpeed: 0.004 + Math.random() * 0.008,
    twinkleOffset: Math.random() * Math.PI * 2,
    color: Math.random() > 0.85
      ? `hsl(${Math.random() > 0.5 ? 195 : 260}, 100%, 80%)`
      : '#ffffff',
  }));

  // Shooting stars
  const shootingStars = [];
  function spawnShootingStar() {
    const angle = (Math.random() * 30 + 15) * (Math.PI / 180); // diagonal downward
    const speed = 8 + Math.random() * 10;
    shootingStars.push({
      x: Math.random() * window.innerWidth * 0.8,
      y: Math.random() * window.innerHeight * 0.4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 80 + Math.random() * 120,
      alpha: 1,
      life: 1,
    });
  }

  // Spawn shooting stars periodically
  setInterval(() => {
    if (Math.random() > 0.3) spawnShootingStar();
  }, 2000);
  spawnShootingStar(); // spawn one immediately

  let frame = 0;
  function drawStarfield() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    // Draw regular stars with twinkle
    stars.forEach(s => {
      const twinkle = 0.5 + 0.5 * Math.sin(frame * s.twinkleSpeed + s.twinkleOffset);
      const alpha = s.alpha * (0.4 + 0.6 * twinkle);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = alpha;
      ctx.fill();

      // Subtle glow for bigger stars
      if (s.r > 1.2) {
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        grd.addColorStop(0, s.color.replace(')', ', 0.3)').replace('rgb', 'rgba').replace('#ffffff', 'rgba(255,255,255,0.3'));
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.globalAlpha = alpha * 0.5;
        ctx.fill();
      }
    });

    // Draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life -= 0.018;

      if (ss.life <= 0 || ss.x > canvas.width + 100 || ss.y > canvas.height + 100) {
        shootingStars.splice(i, 1);
        continue;
      }

      const alpha = ss.life;
      const tailX = ss.x - ss.vx * (ss.len / (Math.abs(ss.vx) + 0.01));
      const tailY = ss.y - ss.vy * (ss.len / (Math.abs(ss.vy) + 0.01));

      const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(0.6, `rgba(180,230,255,${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 1;
      ctx.stroke();

      // Bright tip
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.globalAlpha = alpha;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStarfield);
  }
  drawStarfield();

  // ── FLOATING PARTICLES (code symbols) ──
  const container = document.getElementById('particles');
  const symbols = ['</', '{ }', '=>', '&&', '||', '[]', '++', '//', ';;', '()'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const useSymbol = Math.random() > 0.5;
    if (useSymbol) {
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-duration: ${10 + Math.random() * 12}s;
        animation-delay: ${Math.random() * 10}s;
        width: auto; height: auto;
        background: transparent;
        color: ${Math.random() > 0.5 ? 'rgba(0,212,255,0.25)' : 'rgba(124,58,237,0.25)'};
        font-family: 'JetBrains Mono', monospace;
        font-size: ${0.6 + Math.random() * 0.4}rem;
        border-radius: 0;
      `;
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    } else {
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-duration: ${8 + Math.random() * 10}s;
        animation-delay: ${Math.random() * 8}s;
        width: ${Math.random() > 0.7 ? 3 : 2}px;
        height: ${Math.random() > 0.7 ? 3 : 2}px;
        background: ${Math.random() > 0.5 ? 'rgba(0,212,255,0.6)' : 'rgba(124,58,237,0.6)'};
      `;
    }
    container.appendChild(p);
  }

  // ── MOUSE PARALLAX on LAPTOP ──
  const laptopEl = document.querySelector('.laptop');
  document.addEventListener('mousemove', (e) => {
    if (!laptopEl) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy;
    const rx = 6 + dy * 4;
    const ry = -18 + dx * 6;
    laptopEl.style.transition = 'transform 0.4s ease';
    laptopEl.style.animation = 'none';
    laptopEl.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${dx * 0.5}deg)`;
  });
  document.addEventListener('mouseleave', () => {
    if (!laptopEl) return;
    laptopEl.style.transition = '';
    laptopEl.style.animation = 'laptopFloat 6s ease-in-out infinite';
    laptopEl.style.transform = '';
  });

  // ── INTERSECTION OBSERVER fade-in ──    
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.skill-card, .project-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });