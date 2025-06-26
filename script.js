// EmailJS init e enviarFormulario já aqui, igual antes
(function () {
  emailjs.init('PUBLIC KEY');
})();

function enviarFormulario(event) {
  event.preventDefault();
  const form = event.target;

  emailjs.sendForm('SERVICE KEY', 'TEMPLATE KEY', form)
    .then(() => {
      alert('Mensagem enviada com sucesso! Obrigado pelo contato.');
      form.reset();
    }, (error) => {
      console.error('Erro ao enviar:', error);
      alert('Ocorreu um erro ao enviar. Tente novamente mais tarde.');
    });
}

function smoothScrollTo(targetY, duration = 600) {
  const startY = window.scrollY || window.pageYOffset;
  const diff = targetY - startY;
  let startTime = null;

  function easeInOutQuad(t) {
    return t < 0.5
      ? 2 * t * t
      : -1 + (4 - 2 * t) * t;
  }

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeProgress = easeInOutQuad(progress);
    window.scrollTo(0, startY + diff * easeProgress);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

document.querySelectorAll('a.scroll-link[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');

    if (!targetId || targetId === '#') return;

    e.preventDefault();

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;

      smoothScrollTo(targetPosition, 700);

      // Remove destaque anterior
      document.querySelectorAll('.secao-destacada').forEach(el => {
        el.classList.remove('secao-destacada');
      });

      // Dá um tempo para o scroll começar e então aplica o destaque
      setTimeout(() => {
        targetElement.classList.add('secao-destacada');

        // Remove o destaque após o efeito acabar (2.5s)
        setTimeout(() => {
          targetElement.classList.remove('secao-destacada');
        }, 2500);
      }, 700);
    }
  });
});

window.enviarFormulario = enviarFormulario;
