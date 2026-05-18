/* Charts, table, calculator */
(function () {
  const TABLE_DATA = [
    { bank: 'Kaspi.kz', year: 2021, users: 9.8, churn: 5.1, retention: 94.9, profit: 290.4, assets: 4.1 },
    { bank: 'Kaspi.kz', year: 2022, users: 11.3, churn: 4.8, retention: 95.2, profit: 361.7, assets: 5.1 },
    { bank: 'Kaspi.kz', year: 2023, users: 12.8, churn: 4.4, retention: 95.6, profit: 412.0, assets: 5.8 },
    { bank: 'Kaspi.kz', year: 2024, users: 13.5, churn: 4.2, retention: 95.8, profit: 480.0, assets: 6.4 },
    { bank: 'Kaspi.kz', year: 2025, users: 14.2, churn: 3.9, retention: 96.1, profit: 520.0, assets: 6.9 },
    { bank: 'Kaspi.kz', year: 2026, users: 14.5, churn: 3.7, retention: 96.3, profit: 173.3, assets: 7.1, note: 'Сәуір' },
    { bank: 'Halyk Bank', year: 2021, users: 9.1, churn: 7.9, retention: 92.1, profit: 420.0, assets: 11.8 },
    { bank: 'Halyk Bank', year: 2022, users: 9.8, churn: 7.4, retention: 92.6, profit: 539.3, assets: 13.9 },
    { bank: 'Halyk Bank', year: 2023, users: 10.6, churn: 7.0, retention: 93.0, profit: 580.0, assets: 15.5 },
    { bank: 'Halyk Bank', year: 2024, users: 11.5, churn: 6.8, retention: 93.2, profit: 620.0, assets: 16.8 },
    { bank: 'Halyk Bank', year: 2025, users: 12.0, churn: 6.4, retention: 93.6, profit: 665.0, assets: 17.5 },
    { bank: 'Halyk Bank', year: 2026, users: 12.3, churn: 6.2, retention: 93.8, profit: 221.7, assets: 17.8, note: 'Сәуір' },
    { bank: 'Freedom Bank', year: 2021, users: 0.8, churn: 12.4, retention: 87.6, profit: 18.0, assets: 0.4 },
    { bank: 'Freedom Bank', year: 2022, users: 1.4, churn: 10.8, retention: 89.2, profit: 31.0, assets: 1.2 },
    { bank: 'Freedom Bank', year: 2023, users: 2.2, churn: 9.8, retention: 90.2, profit: 48.0, assets: 2.1 },
    { bank: 'Freedom Bank', year: 2024, users: 3.0, churn: 9.1, retention: 90.9, profit: 67.0, assets: 2.9 },
    { bank: 'Freedom Bank', year: 2025, users: 3.5, churn: 8.5, retention: 91.5, profit: 78.0, assets: 3.3 },
    { bank: 'Freedom Bank', year: 2026, users: 3.7, churn: 8.2, retention: 91.8, profit: 26.0, assets: 3.5, note: 'Сәуір' },
    { bank: 'ForteBank', year: 2021, users: 0.9, churn: 8.9, retention: 91.1, profit: 52.0, assets: 1.8 },
    { bank: 'ForteBank', year: 2022, users: 1.1, churn: 8.2, retention: 91.8, profit: 74.0, assets: 2.3 },
    { bank: 'ForteBank', year: 2023, users: 1.3, churn: 7.6, retention: 92.4, profit: 98.0, assets: 2.8 },
    { bank: 'ForteBank', year: 2024, users: 1.5, churn: 7.3, retention: 92.7, profit: 118.0, assets: 3.2 },
    { bank: 'ForteBank', year: 2025, users: 1.65, churn: 6.9, retention: 93.1, profit: 135.0, assets: 3.45 },
    { bank: 'ForteBank', year: 2026, users: 1.7, churn: 6.7, retention: 93.3, profit: 45.0, assets: 3.5, note: 'Сәуір' }
  ];

  const COLS = [
    { key: 'bank', label: 'Банк' },
    { key: 'year', label: 'Жыл' },
    { key: 'users', label: 'Белсенді пайдаланушылар (млн)' },
    { key: 'churn', label: 'Кету коэфф. (%)' },
    { key: 'retention', label: 'Ұстап қалу (%)' },
    { key: 'profit', label: 'Таза пайда (млрд ₸)' },
    { key: 'assets', label: 'Активтер (трлн ₸)' }
  ];

  const BANK_COLORS = {
    'Kaspi.kz': '#4F9EF8',
    'Halyk Bank': '#22C77A',
    'Freedom Bank': '#F5A623',
    'ForteBank': '#A78BFA'
  };

  let sortKey = 'bank';
  let sortDir = 1;
  let filterText = '';
  let filterBank = '';
  let filterYear = '';
  let page = 0;
  const PAGE_SIZE = 5;

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function getRow(bank, year) {
    return TABLE_DATA.find((r) => r.bank === bank && r.year === year);
  }

  function churnClass(churn) {
    if (churn < 5) return 'churn-good';
    if (churn <= 10) return 'churn-medium';
    return 'churn-bad';
  }

  function formatYearCell(r) {
    if (r.note) {
      return `${r.year} <span class="year-note">${r.note}</span>`;
    }
    return String(r.year);
  }

  function formatChurnCell(churn) {
    return `<span class="churn-cell ${churnClass(churn)}">${churn}</span>`;
  }

  function updateBadges() {
    const container = document.getElementById('filter-badges');
    if (!container) return;
    const badges = [];
    if (filterBank) {
      badges.push({ type: 'bank', label: `Банк: ${filterBank}` });
    }
    if (filterYear) {
      badges.push({ type: 'year', label: `Жыл: ${filterYear}` });
    }
    if (filterText) {
      badges.push({ type: 'search', label: `Іздеу: ${filterText}` });
    }
    container.innerHTML = badges
      .map(
        (b) =>
          `<span class="filter-badge">${b.label}<button type="button" data-clear="${b.type}" aria-label="Жою">×</button></span>`
      )
      .join('');
    container.querySelectorAll('[data-clear]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.clear;
        if (t === 'bank') {
          filterBank = '';
          const el = document.getElementById('filter-bank');
          if (el) el.value = '';
        } else if (t === 'year') {
          filterYear = '';
          const el = document.getElementById('filter-year');
          if (el) el.value = '';
        } else if (t === 'search') {
          filterText = '';
          const el = document.getElementById('table-search');
          if (el) el.value = '';
        }
        page = 0;
        updateBadges();
        renderTable();
      });
    });
  }

  function resetFilters() {
    filterBank = '';
    filterYear = '';
    filterText = '';
    page = 0;
    const bankEl = document.getElementById('filter-bank');
    const yearEl = document.getElementById('filter-year');
    const searchEl = document.getElementById('table-search');
    if (bankEl) bankEl.value = '';
    if (yearEl) yearEl.value = '';
    if (searchEl) searchEl.value = '';
    updateBadges();
    renderTable();
  }

  function initTable() {
    const tbody = document.getElementById('data-tbody');
    const thead = document.getElementById('data-thead');
    const search = document.getElementById('table-search');
    const bankSelect = document.getElementById('filter-bank');
    const yearSelect = document.getElementById('filter-year');
    const resetBtn = document.getElementById('filter-reset');
    if (!tbody || !thead) return;

    thead.innerHTML = `<tr>${COLS.map(
      (c) => `<th data-key="${c.key}" class="${sortKey === c.key ? (sortDir > 0 ? 'sorted-asc' : 'sorted-desc') : ''}">${c.label}</th>`
    ).join('')}</tr>`;

    thead.querySelectorAll('th').forEach((th) => {
      th.addEventListener('click', () => {
        const key = th.dataset.key;
        if (sortKey === key) sortDir *= -1;
        else {
          sortKey = key;
          sortDir = 1;
        }
        page = 0;
        renderTable();
      });
    });

    if (bankSelect) {
      bankSelect.addEventListener('change', (e) => {
        filterBank = e.target.value;
        page = 0;
        updateBadges();
        renderTable();
      });
    }

    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        filterYear = e.target.value;
        page = 0;
        updateBadges();
        renderTable();
      });
    }

    if (search) {
      search.addEventListener('input', (e) => {
        filterText = e.target.value.toLowerCase().trim();
        page = 0;
        updateBadges();
        renderTable();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', resetFilters);
    }

    document.getElementById('page-prev')?.addEventListener('click', () => {
      if (page > 0) {
        page--;
        renderTable();
      }
    });
    document.getElementById('page-next')?.addEventListener('click', () => {
      const filtered = getFiltered();
      if ((page + 1) * PAGE_SIZE < filtered.length) {
        page++;
        renderTable();
      }
    });

    updateBadges();
    renderTable();
  }

  function getFiltered() {
    let rows = [...TABLE_DATA];
    if (filterBank) {
      rows = rows.filter((r) => r.bank === filterBank);
    }
    if (filterYear) {
      rows = rows.filter((r) => String(r.year) === filterYear);
    }
    if (filterText) {
      rows = rows.filter(
        (r) =>
          r.bank.toLowerCase().includes(filterText) ||
          String(r.year).includes(filterText) ||
          (r.note && r.note.toLowerCase().includes(filterText))
      );
    }
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string') return sortDir * av.localeCompare(bv);
      return sortDir * (av - bv);
    });
    return rows;
  }

  function renderTable() {
    const tbody = document.getElementById('data-tbody');
    const thead = document.getElementById('data-thead');
    const pageInfo = document.getElementById('page-info');
    if (!tbody) return;

    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (page >= totalPages) page = totalPages - 1;
    const slice = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    thead.querySelectorAll('th').forEach((th) => {
      th.classList.remove('sorted-asc', 'sorted-desc');
      if (th.dataset.key === sortKey) th.classList.add(sortDir > 0 ? 'sorted-asc' : 'sorted-desc');
    });

    tbody.innerHTML = slice
      .map(
        (r) =>
          `<tr><td>${r.bank}</td><td>${formatYearCell(r)}</td><td>${r.users}</td><td>${formatChurnCell(r.churn)}</td><td>${r.retention}</td><td>${r.profit}</td><td>${r.assets}</td></tr>`
      )
      .join('');

    if (pageInfo) pageInfo.textContent = `${page + 1} / ${totalPages} бет`;
  }

  function chartDefaults() {
    const tick = cssVar('--text-secondary') || 'rgba(232, 234, 240, 0.45)';
    const grid = cssVar('--border') || 'rgba(255, 255, 255, 0.06)';
    return {
      tick,
      grid,
      titleColor: cssVar('--text-primary') || '#E8EAF0',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: tick, font: { family: 'Inter' } } }
        },
        scales: {
          x: { ticks: { color: tick }, grid: { color: grid } },
          y: { ticks: { color: tick }, grid: { color: grid } }
        }
      }
    };
  }

  function initCharts() {
    if (typeof Chart === 'undefined') return;
    const years = [2021, 2022, 2023, 2024, 2025, 2026];
    const banks = ['Kaspi.kz', 'Halyk Bank', 'Freedom Bank', 'ForteBank'];
    const { options: chartOpts, titleColor } = chartDefaults();

    const churnCtx = document.getElementById('chart-churn');
    if (churnCtx) {
      new Chart(churnCtx, {
        type: 'line',
        data: {
          labels: years,
          datasets: banks.map((bank) => ({
            label: bank,
            data: years.map((y) => getRow(bank, y)?.churn),
            borderColor: BANK_COLORS[bank],
            backgroundColor: BANK_COLORS[bank] + '33',
            tension: 0.35,
            fill: false
          }))
        },
        options: {
          ...chartOpts,
          plugins: {
            ...chartOpts.plugins,
            title: { display: true, text: 'Кету коэффициенті динамикасы 2021–2026', color: titleColor }
          }
        }
      });
    }

    const usersCtx = document.getElementById('chart-users');
    if (usersCtx) {
      new Chart(usersCtx, {
        type: 'bar',
        data: {
          labels: years,
          datasets: banks.map((bank) => ({
            label: bank,
            data: years.map((y) => getRow(bank, y)?.users),
            backgroundColor: BANK_COLORS[bank]
          }))
        },
        options: {
          ...chartOpts,
          plugins: {
            ...chartOpts.plugins,
            title: { display: true, text: 'Белсенді пайдаланушылар өсімі (млн)', color: titleColor }
          }
        }
      });
    }

    const shareCtx = document.getElementById('chart-share');
    if (shareCtx) {
      const data2026 = banks.map((b) => getRow(b, 2026)?.users);
      new Chart(shareCtx, {
        type: 'doughnut',
        data: {
          labels: banks,
          datasets: [{
            data: data2026,
            backgroundColor: banks.map((b) => BANK_COLORS[b])
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: cssVar('--text-secondary') } },
            title: { display: true, text: '2026 жылғы нарық үлесі (белсенді пайдаланушылар бойынша)', color: titleColor }
          }
        }
      });
    }

    const retCtx = document.getElementById('chart-retention');
    if (retCtx) {
      new Chart(retCtx, {
        type: 'line',
        data: {
          labels: years,
          datasets: banks.map((bank) => ({
            label: bank,
            data: years.map((y) => getRow(bank, y)?.retention),
            borderColor: BANK_COLORS[bank],
            tension: 0.35
          }))
        },
        options: {
          ...chartOpts,
          plugins: {
            ...chartOpts.plugins,
            title: { display: true, text: 'Ұстап қалу деңгейі тренді 2021–2026', color: titleColor }
          }
        }
      });
    }
  }

  function initCalculator() {
    const form = document.getElementById('churn-calc-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const start = parseFloat(document.getElementById('calc-start').value);
      const end = parseFloat(document.getElementById('calc-end').value);
      const result = document.getElementById('calc-result');
      if (!result || isNaN(start) || isNaN(end) || start <= 0) {
        if (result) {
          result.className = 'calc-result visible bad';
          result.innerHTML = '<p>Дұрыс сандар енгізіңіз.</p>';
        }
        return;
      }
      const churn = ((start - end) / start) * 100;
      const retention = 100 - churn;
      let cls = 'good';
      let msg = 'Жақсы көрсеткіш — кету деңгейі 5%-дан төмен.';
      if (churn >= 5 && churn <= 10) {
        cls = 'medium';
        msg = 'Орташа деңгей — кету 5–10% аралығында.';
      } else if (churn > 10) {
        cls = 'bad';
        msg = 'Жоғары кету деңгейі — 10%-дан асқан, шұғыл шаралар қажет.';
      }
      const period = document.getElementById('calc-period')?.selectedOptions[0]?.text || '';
      result.className = `calc-result visible ${cls}`;
      result.innerHTML = `
        <p><strong>Кезең:</strong> ${period}</p>
        <p><strong>Кету коэффициенті:</strong> ${churn.toFixed(2)}%</p>
        <p><strong>Ұстап қалу деңгейі:</strong> ${retention.toFixed(2)}%</p>
        <p>${msg}</p>`;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTable();
    initCharts();
    initCalculator();
  });
})();
