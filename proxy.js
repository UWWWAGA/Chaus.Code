async function sendCalcDataToTelegram(messageText) {
  const workerUrl = 'https://telegram-proxy.konnss9.workers.dev';

  try {
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messageText,
      }),
    });

    if (response.ok) {
      alert('Заявка успешно отправлена!');
    } else {
      alert('Ошибка при отправке заявки.');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Не удалось связаться с сервером.');
  }
}

const calcBtn = document.getElementById('calcCtaBtn');

if (calcBtn) {
  calcBtn.addEventListener('click', function(e) {
    e.preventDefault();

    const serviceType = document.querySelector('#serviceSelect')?.value || 'Не выбрано';
    const totalPrice = document.querySelector('#totalPrice')?.innerText || '0';

    const message = `<b>🚀 Новая заявка из калькулятора!</b>\n\n<b>Услуга:</b> ${serviceType}\n<b>Стоимость:</b> ${totalPrice} руб.`;

    sendCalcDataToTelegram(message);
  });
}