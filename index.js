/* ═══════════════════════════════════════════════════════════════
   AMAN RAWAT — PORTFOLIO JS
   Handles: Navigation, Scroll Animations, Particles, Counters,
            Skill Bars, Contact Form, Back-to-Top, Active Links
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Particles ─────────────────────────────────────────────
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
      particle.style.animationDuration = (Math.random() * 12 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      // Randomly teal or amber
      particle.style.background = Math.random() > 0.7
        ? 'var(--amber-400)'
        : 'var(--teal-400)';
      particlesContainer.appendChild(particle);
    }
  }

  // ── Navigation — Scroll Styling ───────────────────────────
  const nav = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Nav background
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link
    updateActiveNavLink();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Back to Top ───────────────────────────────────────────
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Mobile Nav Toggle ─────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Active Nav Link on Scroll ─────────────────────────────
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ── Intersection Observer — Scroll Reveal ─────────────────
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve so animations replay if you scroll back
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Skill Bars — Animate on Scroll ────────────────────────
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  let skillsAnimated = false;

  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          skillBars.forEach((bar, index) => {
            const targetWidth = bar.getAttribute('data-width');
            setTimeout(() => {
              bar.style.width = targetWidth + '%';
            }, index * 80);
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  const skillsSection = document.getElementById('skills-grid');
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // ── Counter Animation ─────────────────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          statNumbers.forEach((el, i) => {
            setTimeout(() => animateCounter(el), i * 200);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ── Contact Form ──────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill in all fields.', 'error');
        return;
      }

      // Build mailto link
      const mailtoBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      const mailtoSubject = encodeURIComponent(subject);
      const mailtoLink = `mailto:a.rawat@rgu.ac.uk?subject=${mailtoSubject}&body=${mailtoBody}`;

      window.location.href = mailtoLink;

      showToast('Opening your email client…', 'success');
      contactForm.reset();
    });
  }

  function showToast(message, type) {
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast show toast-' + type;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // ── Smooth Scroll for all anchor links ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Tilt effect on project cards (desktop only) ───────────
  if (window.matchMedia('(min-width: 769px)').matches) {
    const cards = document.querySelectorAll('.project-card, .cert-card, .achievement-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── Magnetic effect on CTA buttons ────────────────────────
  if (window.matchMedia('(min-width: 769px)').matches) {
    const magnetButtons = document.querySelectorAll('.btn-primary, .btn-outline');
    magnetButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ── Typing effect for hero designations ───────────────────
  const designationsEl = document.querySelector('.hero-designations');
  if (designationsEl) {
    const roles = [
      'Computer Science Student',
      'Aspiring Data Analyst',
      'Full Stack Developer',
      'UI/UX Designer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    // After initial animation completes, start typing effect
    setTimeout(() => {
      designationsEl.innerHTML = '';
      designationsEl.style.minHeight = '1.5em';
      typeRole();
    }, 3000);

    function typeRole() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        designationsEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        designationsEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      // Add blinking cursor
      designationsEl.style.borderRight = '2px solid var(--teal-400)';

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end of word
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
      }

      setTimeout(typeRole, typingSpeed);
    }
  }

  // ── Parallax on background glows ──────────────────────────
  const glows = document.querySelectorAll('.bg-glow');
  if (glows.length && window.matchMedia('(min-width: 769px)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      glows.forEach((glow, i) => {
        const factor = i === 0 ? 1 : -0.6;
        glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    }, { passive: true });
  }

});
