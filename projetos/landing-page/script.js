window.onload = function () {
    emailjs.init('dcnOEbAIJbNaJ4shT'); // Public key

    const form = document.getElementById('formularioContato');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      emailjs.sendForm('service_6whbgpk', 'template_zchs3rt', form)
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