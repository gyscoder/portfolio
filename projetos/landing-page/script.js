window.onload = function () {
    emailjs.init('PUBLIC KEY'); // Public key

    const form = document.getElementById('formularioContato');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      emailjs.sendForm('SERVICE', 'TEMPLATE', form)
        .then(() => {
          alert('Mensagem enviada com sucesso!');
          form.reset();
        })
        .catch((error) => {
          console.error('Erro ao enviar:', error);
          alert('Erro ao enviar. Verifique o console.');
        });
    });
  };