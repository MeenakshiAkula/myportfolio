/* ============================================
   MEENAKSHI AKULA — PORTFOLIO SCRIPTS
   Preloader, cursor, scroll reveals, navigation
   ============================================ */

(function () {
  'use strict';

  // ==========================================
  // PRELOADER
  // ==========================================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hide');
      // Trigger hero reveals after preloader hides
      document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('active'), i * 200);
      });
    }, 2000);
  });

  // ==========================================
  // CUSTOM CURSOR (desktop only)
  // ==========================================
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-card, .achievement-card');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hover');
        ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      });
    });
  }

  // ==========================================
  // HEADER SCROLL EFFECT
  // ==========================================
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('sidebar');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ==========================================
  // SCROLL REVEAL (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal:not(.hero .reveal)');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ==========================================
  // SMOOTH SCROLL FOR NAV LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // ACTIVE NAV LINK HIGHLIGHT + DYNAMIC SIDE LABELS
  // ==========================================
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.sidebar__link');
  const sideLabelLeft = document.getElementById('sideLabelLeft');
  const sideLabelRight = document.getElementById('sideLabelRight');
  const sectionsArray = Array.from(sections);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          const label = entry.target.getAttribute('data-label') || id.toUpperCase();

          // Update active nav link
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });

          // Update side labels dynamically
          if (sideLabelLeft) {
            sideLabelLeft.textContent = label;
            sideLabelLeft.setAttribute('href', '#' + id);
          }

          // Right label shows the next section
          const currentIndex = sectionsArray.indexOf(entry.target);
          const nextSection = sectionsArray[currentIndex + 1];
          if (sideLabelRight && nextSection) {
            const nextLabel = nextSection.getAttribute('data-label') || nextSection.id.toUpperCase();
            sideLabelRight.textContent = nextLabel;
            sideLabelRight.setAttribute('href', '#' + nextSection.id);
          } else if (sideLabelRight && !nextSection) {
            // Last section: right label points back to top
            sideLabelRight.textContent = 'TOP';
            sideLabelRight.setAttribute('href', '#hero');
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // ==========================================
  // CONTACT FORM (EmailJS Integration)
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    // Initialize EmailJS with your Public Key
    // emailjs.init("YOUR_PUBLIC_KEY"); 

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('formSubmit');
      const originalText = btn.textContent;
      btn.textContent = 'SENDING...';
      btn.disabled = true;

      // EmailJS configuration
      const serviceID = "YOUR_SERVICE_ID";
      const templateID = "YOUR_TEMPLATE_ID";

      emailjs.sendForm(serviceID, templateID, contactForm)
        .then(() => {
          btn.textContent = 'SENT!';
          btn.style.background = 'var(--clr-warm)';
          contactForm.reset();
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        }, (err) => {
          btn.textContent = 'FAILED!';
          btn.style.background = '#e74c3c';
          console.error('EmailJS Error:', err);
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        });
    });
  }

  // ==========================================
  // PARALLAX HERO IMAGE (subtle)
  // ==========================================
  const heroImage = document.querySelector('.hero__image-wrapper img');
  if (heroImage && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        heroImage.style.transform = 'scale(1.03) translateY(' + scrolled * 0.06 + 'px)';
      }
    });
  }

})();
