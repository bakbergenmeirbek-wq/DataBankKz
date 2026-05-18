/* Common: header, footer, nav, back-to-top */
(function () {
  const NAV_ITEMS = [
    { href: 'index.html', label: 'Басты бет' },
    { href: 'about.html', label: 'Жоба туралы' },
    { href: 'analytics.html', label: 'Аналитика' },
    { href: 'ai-tools.html', label: 'AI Құралдары' },
    { href: 'contact.html', label: 'Байланыс' }
  ];

  function getActivePage() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';
    return file === '' ? 'index.html' : file;
  }

  function renderHeader() {
    const active = getActivePage();
    const navLinks = NAV_ITEMS.map(
      (item) =>
        `<li><a href="${item.href}" class="${active === item.href ? 'active' : ''}">${item.label}</a></li>`
    ).join('');

    return `
      <header class="site-header">
        <div class="container header-inner">
          <a href="index.html" class="logo">Data.kz — <span>Банктік Клиент Талдауы</span></a>
          <button class="nav-toggle" id="nav-toggle" aria-label="Мәзірді ашу">☰</button>
          <nav class="main-nav" id="main-nav">
            <ul>${navLinks}</ul>
          </nav>
        </div>
      </header>`;
  }

  function renderFooter() {
    return `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <h4>Data.kz</h4>
              <p>Қазақстандық банктердегі клиент кетуін талдау жобасы</p>
              <p>Авторлар: <strong>Еслямова Айдана, Мейрбек Бақберген</strong></p>
              <p>Пән: <strong>АКТ</strong></p>
            </div>
            <div>
              <h4>Білім беру</h4>
              <p>Нархоз Университеті — ЦТМ (Цифрлық технологиялар мектебі)</p>
              <p>Бағдарлама: Ақпараттық-коммуникациялық технологиялар</p>
            </div>
            <div>
              <h4>Байланыс</h4>
              <a href="mailto:bankdatakz@gmail.com">bankdatakz@gmail.com</a>
              <div class="social-links">
                <a href="https://wa.me/77471139404" target="_blank" rel="noopener" aria-label="WhatsApp">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href="https://github.com/bakbergenmeirbek-wq/DataBankKz" target="_blank" rel="noopener" aria-label="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://t.me/bankdatakz" target="_blank" rel="noopener" aria-label="Telegram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">© 2026 Data.kz — Нархоз Университеті, ЦТМ, АКТ</div>
        </div>
      </footer>
      <button class="back-to-top" id="back-to-top" aria-label="Жоғарыға оралу">↑</button>`;
  }

  function injectLayout() {
    const headerEl = document.getElementById('site-header');
    const footerEl = document.getElementById('site-footer');
    if (headerEl) headerEl.innerHTML = renderHeader();
    if (footerEl) footerEl.innerHTML = renderFooter();
    initNavToggle();
    initBackToTop();
  }

  function initNavToggle() {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) btn.classList.add('visible');
      else btn.classList.remove('visible');
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ═══════════════════════════════════════════
     Gemini API — кілтті осында қойыңыз
  ═══════════════════════════════════════════ */
  const GEMINI_API_KEY = 'AIzaSyCgB_7t1ai4PxTFgy_17bPsJJ3NEp5YUr0'; // ← осында кілтіңізді қойыңыз

  window['Data.kz'] = window['Data.kz'] || {};

  window['Data.kz'].getApiKey = function () {
    return GEMINI_API_KEY;
  };

  // Anthropic callAnthropic → Gemini callAnthropic (атын сақтадық, chatbot.js өзгертпейміз)
  window['Data.kz'].callAnthropic = async function (messages, systemPrompt) {
    const apiKey = window['Data.kz'].getApiKey();
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new Error('API кілтін main.js файлына енгізіңіз');
    }

    const GEMINI_MODEL = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    // Anthropic messages форматын → Gemini форматына аударамыз
    const geminiContents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: geminiContents,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'API сұрауы сәтсіз аяқталды');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLayout);
  } else {
    injectLayout();
  }
})();
