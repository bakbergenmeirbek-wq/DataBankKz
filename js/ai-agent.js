/**
 * ChurnLens — ai-agent.js
 * Gemini API churn prediction
 */

const API_KEY = 'AIzaSyCEUhW1G-FDeWKDkPrAitBmCP8egLWW4rQ';

const MODEL = 'gemini-2.0-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const SYSTEM_PROMPT =
  'Сіз тұтынушыларды ұстап қалу саласындағы бизнес-аналитиксін. Барлық жауаптарыңызды қазақ тілінде беріңіз. Нақты және практикалық кеңестер беріңіз. Жауапты мына форматта беріңіз:\n' +
  'CHURN_RATE: [сан]%\n' +
  'RISK: [Жоғары/Орта/Төмен]\n' +
  'REC1: [ұсыныс 1]\n' +
  'REC2: [ұсыныс 2]\n' +
  'REC3: [ұсыныс 3]';

(function () {
  'use strict';

  const form = document.getElementById('ai-agent-form');
  const resultsEl = document.getElementById('ai-results');
  const loadingEl = document.getElementById('ai-loading');
  const slider = document.getElementById('inactive-slider');
  const sliderVal = document.getElementById('inactive-value');

  if (!form) return;

  if (slider && sliderVal) {
    slider.addEventListener('input', () => {
      sliderVal.textContent = `${slider.value}%`;
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const customers = document.getElementById('customers-count').value;
    const inactive = document.getElementById('inactive-slider').value;
    const industry = document.getElementById('industry-select').value;
    const contract = document.getElementById('contract-months').value;

    const userMessage = `Тұтынушылар саны: ${customers}
Белсенді емес тұтынушылар: ${inactive}%
Сала: ${industry}
Орташа шарт ұзақтығы: ${contract} ай

Осы деректерге негізделіп болжамды churn rate есептеңіз және 3 нақты ұсыныс беріңіз.`;

    if (API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      showMockResults(customers, inactive, industry, contract);
      return;
    }

    loadingEl.style.display = 'block';
    resultsEl.classList.remove('visible');
    resultsEl.innerHTML = '';

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // System prompt + user message біріктіріледі
          contents: [
            {
              role: 'user',
              parts: [{ text: SYSTEM_PROMPT + '\n\n' + userMessage }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API қатесі: ${response.status} — ${errText}`);
      }

      const data = await response.json();
      // Gemini response структурасы
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      renderResults(text);
    } catch (err) {
      console.error('[ChurnLens] API error:', err);
      resultsEl.innerHTML = `<div class="glass-card"><p class="churn-high">Қате: ${err.message}. API кілтін тексеріңіз.</p></div>`;
      resultsEl.classList.add('visible');
    } finally {
      loadingEl.style.display = 'none';
    }
  });

  function renderResults(text) {
    const churnMatch = text.match(/CHURN_RATE:\s*([\d.]+)%?/i) || text.match(/([\d.]+)\s*%/);
    const riskMatch = text.match(/RISK:\s*(Жоғары|Орта|Төмен)/i);
    const recs = [];
    for (let i = 1; i <= 3; i++) {
      const m = text.match(new RegExp(`REC${i}:\\s*(.+?)(?=\\nREC|$)`, 'is'));
      if (m) recs.push(m[1].trim());
    }
    if (!recs.length) {
      const lines = text.split('\n').filter((l) => l.trim().length > 10);
      recs.push(...lines.slice(0, 3));
    }

    const churn = churnMatch ? `${churnMatch[1]}%` : '—';
    const risk = riskMatch ? riskMatch[1] : 'Орта';
    const riskClass =
      risk.includes('Жоғары') ? 'risk-high' : risk.includes('Төмен') ? 'risk-low' : 'risk-mid';

    resultsEl.innerHTML = `
      <div class="glass-card">
        <span class="risk-badge ${riskClass}">Тәуекел деңгейі: ${risk}</span>
        <h4>Болжамды Churn Rate</h4>
        <p class="stat-value" style="font-size:2rem">${churn}</p>
        <h4>Ұсыныстар</h4>
        <ul>${recs.map((r) => `<li>${r}</li>`).join('') || '<li>Жауап алынбады</li>'}</ul>
        <details style="margin-top:1rem;color:var(--muted);font-size:0.85rem">
          <summary>Толық жауап</summary>
          <pre style="white-space:pre-wrap;margin-top:0.5rem">${text}</pre>
        </details>
      </div>
    `;
    resultsEl.classList.add('visible');
  }

  function showMockResults(customers, inactive, industry, contract) {
    const base = parseFloat(inactive) * 0.6 + (industry.includes('SaaS') ? 5 : industry.includes('Банк') ? 8 : 12);
    const churn = Math.min(45, Math.max(5, base)).toFixed(1);
    const risk = churn > 30 ? 'Жоғары' : churn > 15 ? 'Орта' : 'Төмен';
    const riskClass = risk === 'Жоғары' ? 'risk-high' : risk === 'Төмен' ? 'risk-low' : 'risk-mid';

    loadingEl.style.display = 'block';
    setTimeout(() => {
      loadingEl.style.display = 'none';
      resultsEl.innerHTML = `
        <div class="glass-card">
          <p style="color:var(--muted);font-size:0.85rem;margin-bottom:1rem">⚠ API кілті орнатылмаған — демо нәтиже көрсетілуде</p>
          <span class="risk-badge ${riskClass}">Тәуекел деңгейі: ${risk}</span>
          <h4>Болжамды Churn Rate</h4>
          <p class="stat-value" style="font-size:2rem">${churn}%</p>
          <h4>Ұсыныстар</h4>
          <ul>
            <li>${industry} саласында тұтынушы сегменттеуін жүргізіп, белсенді емес ${inactive}% пайызын қайта тарту бағдарламасына қосыңыз.</li>
            <li>Орташа ${contract} айлық шарт бойынша ${customers} тұтынушыға жекелендірілген лоялдық ұсыныстар жіберіңіз.</li>
            <li>Churn болжам моделін енгізіп, кету белгілерін 30 күн бұрын анықтаңыз.</li>
          </ul>
        </div>
      `;
      resultsEl.classList.add('visible');
    }, 1200);
  }
})();