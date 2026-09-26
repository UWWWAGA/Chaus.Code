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

    // Доп опция: SEO
    if (optSeo && optSeo.checked) {
      min += 2500;
      max += 2500;
    }

    // Доп опция: WordPress + натяжка верстки
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
})(); // Инициализация функции калькулятора

// Функции для кнопок стрелок
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