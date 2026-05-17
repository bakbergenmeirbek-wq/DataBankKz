/**
 * ChurnLens — chatbot.js
 * Gemini API chatbot with conversation history and typewriter effect
 */

const CHAT_API_KEY = 'AIzaSyCEUhW1G-FDeWKDkPrAitBmCP8egLWW4rQ';

const CHAT_MODEL = 'gemini-2.0-flash';
const CHAT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:generateContent`;

const CHAT_SYSTEM =
  'Сіз тұтынушыларды ұстап қалу (churn rate) тақырыбы бойынша маман AI-боттсыз. Барлық жауаптарды қазақ тілінде, қысқаша және анық беріңіз.';

(function () {
  'use strict';

  const messagesEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const chips = document.querySelectorAll('.quick-replies .chip');

  if (!messagesEl || !inputEl) return;

  // Gemini үшін history форматы: [{role, parts:[{text}]}]
  const conversationHistory = [];

  function addBubble(text, role) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    bubble.textContent = text;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function typewriter(el, text, speed = 25) {
    return new Promise((resolve) => {
      let i = 0;
      el.textContent = '';
      function tick() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          messagesEl.scrollTop = messagesEl.scrollHeight;
          setTimeout(tick, speed);
        } else resolve();
      }
      tick();
    });
  }

  async function sendMessage(text) {
    const userText = text.trim();
    if (!userText) return;

    inputEl.value = '';
    addBubble(userText, 'user');

    // Gemini history форматына қосу
    conversationHistory.push({
      role: 'user',
      parts: [{ text: userText }],
    });

    const botBubble = addBubble('...', 'bot');

    if (CHAT_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      const demo = getDemoReply(userText);
      await typewriter(botBubble, demo);
      conversationHistory.push({ role: 'model', parts: [{ text: demo }] });
      return;
    }

    try {
      const response = await fetch(`${CHAT_API_URL}?key=${CHAT_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // System instruction бөлек беріледі
          system_instruction: {
            parts: [{ text: CHAT_SYSTEM }],
          },
          contents: conversationHistory,
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API қатесі: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Жауап алынбады.';

      // Gemini-де assistant role = 'model'
      conversationHistory.push({ role: 'model', parts: [{ text: reply }] });
      await typewriter(botBubble, reply);
    } catch (err) {
      console.error('[ChurnLens] Chat error:', err);
      await typewriter(
        botBubble,
        'Қате орын алды. API кілтін тексеріңіз немесе кейінірек қайталаңыз.'
      );
    }
  }

  function getDemoReply(q) {
    const lower = q.toLowerCase();
    if (lower.includes('дегеніміз') || lower.includes('не')) {
      return 'Churn Rate — белгілі кезеңде қызметтен кеткен тұтынушылардың жалпы базаға қатынасы. Мысалы, 100 тұтынушыдан 27 кетсе, churn rate 27% болады.';
    }
    if (lower.includes('азайту') || lower.includes('қалай')) {
      return 'Churn азайту үшін: 1) жекелендірілген ұсыныстар, 2) лоялдық бағдарламасы, 3) ерте кету белгілерін болжамдау, 4) тұтынушы қанағаттануын өлшеу.';
    }
    if (lower.includes('лоялдық')) {
      return 'Лоялдық бағдарламасы — бонус, жеңілдік немесе эксклюзивті мүмкіндіктер арқылы тұтынушыны ұстап қалу. Нәтиже: қайта сатып алу жиілігі артады, churn төмендейді.';
    }
    return 'Мысал: телеком компаниясында ай сайын 3% churn болса, жылдық тұтынушы базасының ~30%-ы жоғалуы мүмкін. Бұл деректерді кестеде талдауға болады.';
  }

  sendBtn?.addEventListener('click', () => sendMessage(inputEl.value));
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl.value);
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => sendMessage(chip.textContent));
  });

  addBubble('Сәлеметсіз бе! Мен Churn Rate бойынша AI көмекшісімін. Сұрақ қойыңыз.', 'bot');
})();