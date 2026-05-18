/* AI chatbot + insight generator */
(function () {
  const SYSTEM_CHAT = `Сіз Data.kz — Қазақстан банктеріндегі клиент кетуін талдауға маманданған AI аналитик көмекшісісіз. Kaspi.kz, Halyk Bank, Freedom Bank және ForteBank туралы терең білімдерге ие. Кету коэффициенттерін, ұстап қалу стратегияларын, клиент адалдығын және Қазақстандағы банктік трендтерді түсіндіре аласыз. Барлық жауаптарыңызды қазақ тілінде беріңіз. Нақты деректер: Kaspi.kz кету ~4,2% (2024), 13,5 млн пайдаланушы; Halyk Bank кету ~6,8% (2024), 11,5 млн клиент; Freedom Bank кету ~9,1% (2024), 3 млн клиент; ForteBank кету ~7,3% (2024), 1,5 млн клиент.`;

  const SYSTEM_INSIGHT =
    'Қазақстан банктеріндегі клиент кетуі мен ұстап қалу туралы 2024–2025 жылдарға арналған бірегей, деректерге негізделген 3 сөйлемді аналитикалық инсайт жасаңыз. Цифрлық трансформация, super-app адалдығы немесе бәсекелі динамикаға назар аударыңыз. Жауапты толығымен қазақ тілінде беріңіз.';

  const SUGGESTIONS = [
    'Қай банктің кету деңгейі ең төмен?',
    'Кету коэффициенті қалай есептеледі?',
    'Клиент кетуін азайтуға қандай стратегиялар бар?',
    'Kaspi мен Halyk-тың ұстап қалу деңгейін салыстыр'
  ];

  let conversationHistory = [];

  function initChatbot() {
    const fab = document.getElementById('chat-fab');
    const panel = document.getElementById('chat-panel');
    const close = document.getElementById('chat-close');
    const send = document.getElementById('chat-send');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    const suggestions = document.getElementById('chat-suggestions');

    if (!fab || !panel) return;

    fab.addEventListener('click', () => panel.classList.toggle('open'));
    close?.addEventListener('click', () => panel.classList.remove('open'));

    if (suggestions) {
      suggestions.innerHTML = SUGGESTIONS.map(
        (s) => `<button type="button" data-q="${s}">${s}</button>`
      ).join('');
      suggestions.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (input) input.value = btn.dataset.q;
          sendMessage();
        });
      });
    }

    const apiBanner = document.getElementById('api-key-banner');
    if (apiBanner && !window['Data.kz']?.getApiKey()) {
      apiBanner.style.display = 'block';
      apiBanner.querySelector('button')?.addEventListener('click', () => window['Data.kz'].showApiKeyModal());
    }

    send?.addEventListener('click', sendMessage);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    function appendMsg(text, role) {
      const div = document.createElement('div');
      div.className = `chat-msg ${role}`;
      div.textContent = text;
      messages?.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      return div;
    }

    async function sendMessage() {
      const text = input?.value?.trim();
      if (!text || !messages) return;
      input.value = '';
      appendMsg(text, 'user');
      conversationHistory.push({ role: 'user', content: text });
      const loading = appendMsg('...', 'loading');

      try {
        const reply = await window['Data.kz'].callAnthropic(conversationHistory, SYSTEM_CHAT);
        loading.remove();
        appendMsg(reply, 'bot');
        conversationHistory.push({ role: 'assistant', content: reply });
      } catch (err) {
        loading.remove();
        appendMsg(err.message || 'Қате орын алды. API кілтін тексеріңіз.', 'bot');
      }
    }

    window.churniqSendChat = sendMessage;
  }

  function initInsightGenerator() {
    const btn = document.getElementById('insight-generate');
    const out = document.getElementById('insight-output');
    if (!btn || !out) return;

    btn.addEventListener('click', async () => {
      out.innerHTML = '<div class="spinner"></div>';
      btn.disabled = true;
      try {
        const text = await window['Data.kz'].callAnthropic(
          [{ role: 'user', content: 'Жаңа инсайт жасаңыз.' }],
          SYSTEM_INSIGHT
        );
        out.innerHTML = `<div class="card"><p>${text.replace(/\n/g, '</p><p>')}</p></div>`;
      } catch (err) {
        out.innerHTML = `<p style="color:var(--danger)">${err.message}. <button class="btn btn-outline" onclick="window['Data.kz'].showApiKeyModal()">API кілтін енгізу</button></p>`;
      }
      btn.disabled = false;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
    initInsightGenerator();
  });
})();
