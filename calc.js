(function initCalculator() {
  const calcTabs = document.querySelectorAll('.calc-tab');
  const groupHours = document.getElementById('groupHours');
  const groupBlocks = document.getElementById('groupBlocks');
  const calcHoursInput = document.getElementById('calcHours');
  const calcBlocksInput = document.getElementById('calcBlocks');
  const optSeo = document.getElementById('optSeo');
  const optWp = document.getElementById('optWp');

  const priceMinEl = document.getElementById('calcPriceMin');
  const priceAvgEl = document.getElementById('calcPriceAvg');
  const priceMaxEl = document.getElementById('calcPriceMax');

  if (!calcHoursInput || !calcBlocksInput) return;

  let currentMode = 'hours';

  calcTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      calcTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentMode = tab.dataset.mode;

      if (currentMode === 'hours') {
        groupHours.classList.remove('hidden');
        groupBlocks.classList.add('hidden');
      } else {
        groupHours.classList.add('hidden');
        groupBlocks.classList.remove('hidden');
      }
      calculate();
    });
  });

  [calcHoursInput, calcBlocksInput, optSeo, optWp].forEach(el => {
    if (el) {
      el.addEventListener('input', calculate);
      el.addEventListener('change', calculate);
    }
  });

  function formatPrice(val) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(val)) + ' ₽';
  }

  function calculate() {
    let min = 0;
    let max = 0;

    if (currentMode === 'hours') {
      const hours = Math.max(1, parseFloat(calcHoursInput.value) || 0);
      const baseCost = hours * 1250;
      min = baseCost;
      max = baseCost;
    } else {
      const blocks = Math.max(1, parseFloat(calcBlocksInput.value) || 0);
      min = blocks * 250;
      max = blocks * 1000;
    }

    if (optSeo && optSeo.checked) {
      min += 2500;
      max += 2500;
    }

    if (optWp && optWp.checked) {
      const baseWp = 2000;
      let blocksCount = 1;
      if (currentMode === 'blocks') {
        blocksCount = Math.max(1, parseFloat(calcBlocksInput.value) || 0);
      } else {
        const hours = Math.max(1, parseFloat(calcHoursInput.value) || 0);
        blocksCount = Math.max(1, Math.round(hours / 2));
      }

      min += baseWp + (blocksCount * 250);
      max += baseWp + (blocksCount * 700);
    }

    const avg = (min + max) / 2;

    if (priceMinEl) priceMinEl.textContent = formatPrice(min);
    if (priceAvgEl) priceAvgEl.textContent = formatPrice(avg);
    if (priceMaxEl) priceMaxEl.textContent = formatPrice(max);
  }

  calculate();
})();

function stepUp(id) {
  const el = document.getElementById(id);
  if (el) {
    el.stepUp();
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function stepDown(id) {
  const el = document.getElementById(id);
  if (el) {
    el.stepDown();
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function sendCalcToTelegram() {
  const mode = document.querySelector('.calc-tab.active')?.dataset.mode === 'hours' ? 'По часам' : 'По блокам';
  const hours = document.getElementById('calcHours')?.value || 0;
  const blocks = document.getElementById('calcBlocks')?.value || 0;
  const optSeo = document.getElementById('optSeo')?.checked ? 'Да' : 'Нет';
  const optWp = document.getElementById('optWp')?.checked ? 'Да' : 'Нет';
  const priceAvg = document.getElementById('calcPriceAvg')?.innerText || '0 ₽';

  let detail = mode === 'По часам' ? `${hours} ч.` : `${blocks} блоков`;

  const text = `Привет! Хочу обсудить проект.\n\n` +
               `📊 Расчет из калькулятора:\n` +
               `• Формат: ${mode} (${detail})\n` +
               `• Базовая SEO-настройка: ${optSeo}\n` +
               `• Подключение WordPress: ${optWp}\n` +
               `• Примерная стоимость: ${priceAvg}`;

  const tgUrl = `https://t.me/buwaga?text=${encodeURIComponent(text)}`;
  window.open(tgUrl, '_blank');
}

