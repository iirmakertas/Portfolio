/* ==========================================
   SCRIPT.JS — PORTFOLIO LOGIC
   ========================================== */

// ---- DOM READY ----
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLang();
  initNavbar();
  initHamburger();
  initTypewriter();
  initScrollReveal();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  initEmailCopy();
  initNavActiveLinks();
});

/* ======================
   THEME TOGGLE
   ====================== */
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ======================
   LANGUAGE TOGGLE (TR / EN)
   ====================== */
let currentLang = localStorage.getItem('lang') || 'tr';

function initLang() {
  const toggle = document.getElementById('langToggle');
  applyLang(currentLang);

  toggle.addEventListener('click', () => {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    localStorage.setItem('lang', currentLang);
    applyLang(currentLang);
  });
}

function applyLang(lang) {
  // Update label display
  const label = document.getElementById('langLabel');
  const toggle = document.getElementById('langToggle');
  const langActive = toggle.querySelector('.lang-active');
  const langInactive = toggle.querySelector('.lang-inactive');
  if (lang === 'tr') {
    langActive.textContent = 'TR';
    langInactive.textContent = 'EN';
  } else {
    langActive.textContent = 'EN';
    langInactive.textContent = 'TR';
  }

  // Update all elements with data-tr / data-en
  const elements = document.querySelectorAll('[data-tr][data-en]');
  elements.forEach(el => {
    const text = lang === 'tr' ? el.getAttribute('data-tr') : el.getAttribute('data-en');
    if (text !== null) {
      // Handle inputs/placeholders differently
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        el.textContent = text;
      } else {
        el.textContent = text;
      }
    }
  });

  // Typewriter re-init
  initTypewriter(lang);

  // Update html lang attr
  document.documentElement.setAttribute('lang', lang);
}

/* ======================
   NAVBAR SCROLL
   ====================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ======================
   HAMBURGER MENU
   ====================== */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    hamburger.classList.toggle('active');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

/* ======================
   TYPEWRITER EFFECT
   ====================== */
const typewriterTextsTR = [
  'Yazılım Geliştirici 💻',
  'YBS Öğrencisi 🎓',
  'Mobil Uygulama Geliştirici 📱',
  'Web Tasarımcısı 🌐',
  'Veri Tutkunu 📊'
];
const typewriterTextsEN = [
  'Software Developer 💻',
  'MIS Student 🎓',
  'Mobile App Developer 📱',
  'Web Designer 🌐',
  'Data Enthusiast 📊'
];
let typeIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimer = null;

function initTypewriter(lang) {
  const el = document.getElementById('typewriter-text');
  if (!el) return;
  clearTimeout(typeTimer);
  el.textContent = '';
  charIndex = 0;
  isDeleting = false;
  typeIndex = 0;
  typeLoop(lang || currentLang);
}

function typeLoop(lang) {
  const el = document.getElementById('typewriter-text');
  if (!el) return;
  const texts = lang === 'tr' ? typewriterTextsTR : typewriterTextsEN;
  const current = texts[typeIndex % texts.length];
  const chars = Array.from(current);

  if (!isDeleting) {
    el.textContent = chars.slice(0, charIndex + 1).join('');
    charIndex++;
    if (charIndex === chars.length) {
      isDeleting = true;
      typeTimer = setTimeout(() => typeLoop(lang), 2000);
      return;
    }
  } else {
    el.textContent = chars.slice(0, charIndex - 1).join('');
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      typeIndex++;
    }
  }
  typeTimer = setTimeout(() => typeLoop(lang), isDeleting ? 60 : 90);
}

/* ======================
   SCROLL REVEAL
   ====================== */
function initScrollReveal() {
  // Add reveal class to sections
  const targets = document.querySelectorAll('.section-header, .about-grid, .skill-card, .timeline-item, .project-card, .contact-wrapper');
  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ======================
   SKILL BARS ANIMATION
   ====================== */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.style.getPropertyValue('--pct');
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ======================
   PROJECT FILTER
   ====================== */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ======================
   CONTACT FORM
   ====================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const isTR = currentLang === 'tr';

    btn.disabled = true;
    btn.innerHTML = `<span>${isTR ? '⏳ Gönderiliyor...' : '⏳ Sending...'}</span>`;

    const formData = new FormData(form);
    
    fetch('https://formsubmit.co/ajax/irmakertas242@gmail.com', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      })
    })
    .then(response => response.json())
    .then(data => {
      btn.innerHTML = `<span>✅ ${isTR ? 'Mesaj Gönderildi!' : 'Message Sent!'}</span>`;
      form.reset();
    })
    .catch(error => {
      console.error(error);
      btn.innerHTML = `<span>❌ ${isTR ? 'Hata Oluştu!' : 'Error Occurred!'}</span>`;
    })
    .finally(() => {
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `<span data-tr="Mesaj Gönder" data-en="Send Message">${isTR ? 'Mesaj Gönder' : 'Send Message'}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      }, 3000);
    });
  });
}

/* ======================
   ACTIVE NAV LINKS
   ====================== */
function initNavActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ======================
   SMOOTH SCROLL POLYFILL
   ====================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    // Only intercept if class does not contain open-modal-btn
    if (anchor.classList.contains('open-modal-btn')) return;
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    try {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      console.warn('Invalid scroll target:', href);
    }
  });
});

/* ======================
   PROJECT DETAILS MODAL
   ===================== */
document.addEventListener('DOMContentLoaded', () => {
  initProjectModal();
});

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const closeBtn = document.getElementById('modalCloseBtn');
  const backdrop = modal.querySelector('.modal-backdrop');
  
  const mTitle = document.getElementById('modalTitle');
  const mDesc = document.getElementById('modalDesc');
  const mTech = document.getElementById('modalTech');
  const mFeatures = document.getElementById('modalFeatures');
  const mSlider = document.getElementById('modalSlider');
  const mArrows = document.getElementById('sliderArrows');

  let currentImages = [];
  let currentImageIdx = 0;

  // Open modal handler
  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const dataset = btn.dataset;
      const isTR = currentLang === 'tr';

      // Load Title & Desc
      mTitle.textContent = isTR ? dataset.titleTr : dataset.titleEn;
      mDesc.textContent = isTR ? dataset.descTr : dataset.descEn;

      // Load Tech
      mTech.innerHTML = '';
      if (dataset.tech) {
        dataset.tech.split(',').forEach(t => {
          const span = document.createElement('span');
          span.textContent = t.trim();
          mTech.appendChild(span);
        });
      }

      // Load Features
      mFeatures.innerHTML = '';
      const featuresStr = isTR ? dataset.featuresTr : dataset.featuresEn;
      if (featuresStr) {
        featuresStr.split(',').forEach(f => {
          const li = document.createElement('li');
          li.textContent = f.trim();
          mFeatures.appendChild(li);
        });
      }

      // Load Gallery Images
      mSlider.innerHTML = '';
      currentImages = [];
      currentImageIdx = 0;

      // If project has specific images (e.g. Space Survivor), use them.
      // Otherwise, we look at the project card container's sibling background image or placeholder.
      if (dataset.images) {
        currentImages = dataset.images.split(',').map(img => img.trim());
      } else {
        // Fallback to the project's card image if exists
        const card = btn.closest('.project-card');
        const imgEl = card ? card.querySelector('.project-img') : null;
        if (imgEl && imgEl.getAttribute('src')) {
          currentImages.push(imgEl.getAttribute('src'));
        }
      }

      if (currentImages.length > 0) {
        currentImages.forEach(src => {
          const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm') || src.toLowerCase().endsWith('.ogg');
          if (isVideo) {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.playsInline = true;
            video.style.width = '100%';
            video.style.height = 'auto';
            video.style.display = 'block';
            mSlider.appendChild(video);
          } else {
            const img = document.createElement('img');
            img.src = src;
            img.alt = mTitle.textContent;
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.objectFit = 'normal';
            mSlider.appendChild(img);
          }
        });
        mArrows.style.display = currentImages.length > 1 ? 'flex' : 'none';
      } else {
        // Ultimate fallback placeholder
        const img = document.createElement('img');
        img.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600';
        img.alt = 'Placeholder';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.objectFit = 'normal';
        mSlider.appendChild(img);
        mArrows.style.display = 'none';
      }

      updateSliderPosition();

      // Show modal
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock scroll
    });
  });

  // Slider navigation
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentImages.length <= 1) return;
      currentImageIdx = (currentImageIdx - 1 + currentImages.length) % currentImages.length;
      updateSliderPosition();
    });

    nextBtn.addEventListener('click', () => {
      if (currentImages.length <= 1) return;
      currentImageIdx = (currentImageIdx + 1) % currentImages.length;
      updateSliderPosition();
    });
  }

  function updateSliderPosition() {
    mSlider.style.transform = `translateX(-${currentImageIdx * 100}%)`;
    mSlider.style.transition = 'transform 0.4s ease';
    
    // Pause all videos when slide changes
    mSlider.querySelectorAll('video').forEach(video => {
      video.pause();
    });
  }

  // Close modal function
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock scroll
    
    // Pause all videos when modal closes
    mSlider.querySelectorAll('video').forEach(video => {
      video.pause();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ======================
   EMAIL COPY TO CLIPBOARD
   ====================== */
function initEmailCopy() {
  const emailBtn = document.getElementById('socialEmail');
  if (!emailBtn) return;

  emailBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link navigation behavior
    const email = 'irmakertas242@gmail.com';
    
    // Attempt copy using clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(() => {
          showFeedback();
          window.location.href = 'mailto:' + email;
        })
        .catch(err => {
          console.error('Could not copy email: ', err);
          window.location.href = 'mailto:' + email;
        });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = email;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showFeedback();
      } catch (err) {
        console.error('Fallback copy failed: ', err);
      }
      document.body.removeChild(textArea);
      window.location.href = 'mailto:' + email;
    }
  });

  function showFeedback() {
    const htmlLang = document.documentElement.getAttribute('lang') || 'tr';
    const isTR = htmlLang === 'tr';
    
    const textSpan = emailBtn.querySelector('span');
    if (!textSpan) return;
    
    const originalText = textSpan.textContent;
    
    emailBtn.style.pointerEvents = 'none';
    textSpan.textContent = isTR ? 'Kopyalandı!' : 'Copied!';
    
    setTimeout(() => {
      textSpan.textContent = originalText;
      emailBtn.style.pointerEvents = '';
    }, 2000);
  }
}
