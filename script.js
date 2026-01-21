/* Vitrine Digital — comportamento em JS puro
   - Mobile menu toggle (a11y)
   - Smooth scroll (anchors já com css smooth; adicionamos foco)
   - Form validation e feedback (simula envio)
   - Dark mode toggle com persistência (localStorage)
   - Reveal on scroll (IntersectionObserver)
   - Comentários explicativos inclusos
*/

(() => {
  // Cache elementos frequentemente usados
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const themeToggle = document.getElementById('themeToggle');
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const yearFooter = document.getElementById('yearFooter');

  // PREENCHER ANO NO RODAPÉ
  if (yearFooter) yearFooter.textContent = new Date().getFullYear();

  // ----------------------
  // Mobile Menu (a11y)
  // ----------------------
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        mobileMenu.hidden = true;
      } else {
        mobileMenu.hidden = false;
        // Move focus to first link for keyboard users
        const first = mobileMenu.querySelector('a');
        if (first) first.focus();
      }
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.hidden = true;
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.hidden) {
        mobileMenu.hidden = true;
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.focus();
      }
    });
  }

  // ----------------------
  // Theme (dark mode) with persistence
  // ----------------------
  const THEME_KEY = 'vitrine_theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) root.setAttribute('data-theme', saved);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      if (next === 'dark') root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, next === 'dark' ? 'dark' : 'light');
    });
  }

  // ----------------------
  // Smooth scrolling accessibility fix:
  // Ensure focus goes to target after scroll
  // ----------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // After scrolling, focus the target for screen readers
          window.setTimeout(() => {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
          }, 400);
        }
      }
    });
  });

  // ----------------------
  // Contact form validation & simulated submission
  // ----------------------
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      let valid = true;

      if (name.length < 2) {
        showError('name', 'Por favor informe seu nome (mínimo 2 caracteres).');
        valid = false;
      }

      if (!validateEmail(email)) {
        showError('email', 'Informe um email válido.');
        valid = false;
      }

      if (message.length < 10) {
        showError('message', 'Mensagem muito curta (mínimo 10 caracteres).');
        valid = false;
      }

      if (!valid) {
        formFeedback.textContent = 'Verifique os campos e tente novamente.';
        return;
      }

      // Simular envio (aqui você pode integrar com API/Netlify/Formspree)
      formFeedback.textContent = 'Enviando...';
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      // Simulação de rede
      setTimeout(() => {
        formFeedback.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
        contactForm.reset();
        submitBtn.disabled = false;
      }, 1100);
    });

    // Helpers
    function showError(field, msg) {
      const el = document.getElementById(`error-${field}`);
      if (el) el.textContent = msg;
      const input = document.getElementById(field);
      if (input) input.setAttribute('aria-invalid', 'true');
    }

    function clearErrors() {
      ['name', 'email', 'message'].forEach(f => {
        const el = document.getElementById(`error-${f}`);
        if (el) el.textContent = '';
        const input = document.getElementById(f);
        if (input) input.removeAttribute('aria-invalid');
      });
      formFeedback.textContent = '';
    }

    function validateEmail(email) {
      // Simples regex de validação (suficiente para a maioria dos casos)
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  }

  // ----------------------
  // Reveal on scroll (IntersectionObserver)
  // ----------------------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // anima apenas uma vez
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => obs.observe(r));
  } else {
    // Fallback: mostrar todos
    reveals.forEach(r => r.classList.add('is-visible'));
  }

  // ----------------------
  // Light enhancements: keyboard accessibility for product cards
  // ----------------------
  document.querySelectorAll('.produto-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        // Simular clique: levar ao contato
        const more = card.querySelector('.btn') || document.querySelector('a[href="#contato"]');
        if (more) more.click();
      }
    });
  });

  // ----------------------
  // Optional: Load additional products dynamically from JSON (example)
  // ----------------------
  // fetch('data/products.json').then(r => r.json()).then(renderProducts).catch(()=>{/* no-op */});

  // function renderProducts(items){
  //   const grid = document.getElementById('produtosGrid');
  //   items.forEach(item => {
  //     // criar cards e append (exemplo omitido por brevidade)
  //   });
  // }

  // End of IIFE
})();
