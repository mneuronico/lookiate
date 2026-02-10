/* ═══════════════════════════════════════════════════════════════
   LOOK-IA-TE | SEDAL — Interactive Script
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Language Toggle ──────────────────────────────────────────
  const langBtn = document.getElementById('lang-toggle');
  langBtn.addEventListener('click', () => {
    document.body.classList.toggle('lang-en');
    document.body.classList.toggle('lang-es');
  });

  // ── Mobile Menu ──────────────────────────────────────────────
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  mobileBtn.addEventListener('click', () => {
    mobileBtn.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileBtn.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ── Navbar Scroll Effect ─────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Scroll Reveal (Intersection Observer) ────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Don't unobserve to allow re-triggering if desired, but for perf unobserve:
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });
  reveals.forEach(el => revealObserver.observe(el));

  // ── Animated Counters ────────────────────────────────────────
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ── Stat Ring Animation ──────────────────────────────────────
  const statRings = document.querySelectorAll('.stat-ring');
  const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        ringObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statRings.forEach(el => ringObserver.observe(el));

  // ── Step Connector Animation ─────────────────────────────────
  const connectors = document.querySelectorAll('.step-connector');
  const connectorObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        connectorObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  connectors.forEach(el => connectorObserver.observe(el));

  // ── AI Picker: Auto-fill recommended card on load ────────────
  const recommendedCard = document.querySelector('.look-card.recommended');
  if (recommendedCard) {
    const pickerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger the fill for the recommended card
          const fill = recommendedCard.querySelector('.match-fill');
          const label = recommendedCard.querySelector('.match-label');
          if (fill) fill.style.width = fill.style.getPropertyValue('--match') + '%';
          pickerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    pickerObserver.observe(recommendedCard);
  }

  // ══════════════════════════════════════════════════════════════
  // HERO CANVAS — Flowing Hair Particle System
  // ══════════════════════════════════════════════════════════════
  const heroCanvas = document.getElementById('hero-canvas');
  const ctx = heroCanvas.getContext('2d');
  let heroW, heroH;
  let particles = [];
  const PARTICLE_COUNT = 80;

  function resizeHeroCanvas() {
    heroW = heroCanvas.width = heroCanvas.offsetWidth;
    heroH = heroCanvas.height = heroCanvas.offsetHeight;
  }
  resizeHeroCanvas();
  window.addEventListener('resize', resizeHeroCanvas);

  class HairParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * heroW;
      this.y = Math.random() * heroH;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = Math.random() * 0.3 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.amplitude = Math.random() * 60 + 20;
      this.frequency = Math.random() * 0.008 + 0.003;
      this.phase = Math.random() * Math.PI * 2;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.baseX = this.x;

      // Color: pink or silver
      if (Math.random() > 0.4) {
        const r = 230;
        const g = Math.floor(Math.random() * 30);
        const b = 126 + Math.floor(Math.random() * 60);
        this.color = `${r}, ${g}, ${b}`;
      } else {
        const v = 180 + Math.floor(Math.random() * 40);
        this.color = `${v}, ${v}, ${v + 20}`;
      }
    }
    update(time) {
      this.y -= this.speedY;
      this.x = this.baseX + Math.sin(this.y * this.frequency + this.phase + time * 0.0005) * this.amplitude;

      if (this.y < -10 || this.x < -50 || this.x > heroW + 50) {
        this.reset();
        this.y = heroH + 10;
        this.baseX = Math.random() * heroW;
        this.x = this.baseX;
      }
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();

      // Glow
      if (this.size > 1.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity * 0.15})`;
        ctx.fill();
      }
    }
  }

  // Create flowing strand lines
  class HairStrand {
    constructor() {
      this.reset();
    }
    reset() {
      this.startX = Math.random() * heroW;
      this.startY = heroH + 20;
      this.length = Math.random() * 200 + 100;
      this.speed = Math.random() * 0.4 + 0.15;
      this.amplitude = Math.random() * 40 + 15;
      this.frequency = Math.random() * 0.01 + 0.005;
      this.phase = Math.random() * Math.PI * 2;
      this.lineWidth = Math.random() * 1.2 + 0.3;
      this.progress = 0;

      if (Math.random() > 0.5) {
        this.color = `rgba(230, 0, 126, ${Math.random() * 0.15 + 0.05})`;
      } else {
        this.color = `rgba(192, 192, 208, ${Math.random() * 0.12 + 0.03})`;
      }
    }
    update(time) {
      this.progress += this.speed;
      if (this.progress > this.length + heroH) {
        this.reset();
      }
    }
    draw(ctx, time) {
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.lineWidth;

      const segments = 30;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const y = this.startY - this.progress + t * this.length;
        const x = this.startX + Math.sin(y * this.frequency + this.phase + time * 0.0003) * this.amplitude;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  // Init particles and strands
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new HairParticle());
  }
  const strands = [];
  for (let i = 0; i < 20; i++) {
    strands.push(new HairStrand());
  }

  function animateHero(time) {
    ctx.clearRect(0, 0, heroW, heroH);

    // Draw strands
    strands.forEach(s => {
      s.update(time);
      s.draw(ctx, time);
    });

    // Draw particles
    particles.forEach(p => {
      p.update(time);
      p.draw(ctx);
    });

    requestAnimationFrame(animateHero);
  }
  requestAnimationFrame(animateHero);

  // ══════════════════════════════════════════════════════════════
  // CURSOR TRAIL — Pink Sparkle Particles
  // ══════════════════════════════════════════════════════════════
  const cursorCanvas = document.getElementById('cursor-canvas');
  const cctx = cursorCanvas.getContext('2d');
  let cW, cH;
  const cursorParticles = [];
  let mouseX = -100, mouseY = -100;

  function resizeCursorCanvas() {
    cW = cursorCanvas.width = window.innerWidth;
    cH = cursorCanvas.height = window.innerHeight;
  }
  resizeCursorCanvas();
  window.addEventListener('resize', resizeCursorCanvas);

  // Only track mouse on non-touch devices
  const isTouch = 'ontouchstart' in window;
  if (!isTouch) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Spawn a few particles
      for (let i = 0; i < 2; i++) {
        cursorParticles.push({
          x: mouseX + (Math.random() - 0.5) * 10,
          y: mouseY + (Math.random() - 0.5) * 10,
          size: Math.random() * 3 + 1,
          life: 1,
          decay: Math.random() * 0.03 + 0.015,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          color: Math.random() > 0.5 ? '230, 0, 126' : '192, 192, 220'
        });
      }
    });
  }

  function animateCursor() {
    cctx.clearRect(0, 0, cW, cH);

    for (let i = cursorParticles.length - 1; i >= 0; i--) {
      const p = cursorParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.size *= 0.98;

      if (p.life <= 0) {
        cursorParticles.splice(i, 1);
        continue;
      }

      cctx.beginPath();
      cctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      cctx.fillStyle = `rgba(${p.color}, ${p.life * 0.6})`;
      cctx.fill();
    }

    // Limit particle count
    if (cursorParticles.length > 150) {
      cursorParticles.splice(0, cursorParticles.length - 150);
    }

    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // ══════════════════════════════════════════════════════════════
  // SMOOTH SCROLL for anchor links
  // ══════════════════════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ══════════════════════════════════════════════════════════════
  // MIRROR FRAME SHIMMER — Follow mouse on video section
  // ══════════════════════════════════════════════════════════════
  const mirrorFrame = document.querySelector('.mirror-frame');
  if (mirrorFrame && !isTouch) {
    mirrorFrame.addEventListener('mousemove', (e) => {
      const rect = mirrorFrame.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const shine = mirrorFrame.querySelector('.mirror-shine');
      if (shine) {
        shine.style.animation = 'none';
        shine.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
      }
    });
    mirrorFrame.addEventListener('mouseleave', () => {
      const shine = mirrorFrame.querySelector('.mirror-shine');
      if (shine) {
        shine.style.background = '';
        shine.style.animation = '';
      }
    });
  }

  // ══════════════════════════════════════════════════════════════
  // LOOK CARDS — Interactive match animation
  // ══════════════════════════════════════════════════════════════
  const lookCards = document.querySelectorAll('.look-card');
  lookCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Dim other cards slightly
      lookCards.forEach(c => {
        if (c !== card) c.style.opacity = '0.6';
      });
    });
    card.addEventListener('mouseleave', () => {
      lookCards.forEach(c => c.style.opacity = '1');
    });
  });

  // ══════════════════════════════════════════════════════════════
  // PARALLAX-LIKE EFFECT for hero content
  // ══════════════════════════════════════════════════════════════
  const heroContent = document.querySelector('.hero-content');
  if (!isTouch) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        const progress = scrollY / window.innerHeight;
        heroContent.style.transform = `translateY(${progress * 80}px)`;
        heroContent.style.opacity = 1 - progress * 1.2;
      }
    }, { passive: true });
  }

  // ══════════════════════════════════════════════════════════════
  // ACTIVE NAV LINK highlight on scroll
  // ══════════════════════════════════════════════════════════════
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
});
