const formEmail = document.querySelector('.formEmail');
const inscrevaSe = document.querySelector('.inscrevaSe');
const aviso = document.querySelector('.aviso');

inscrevaSe.addEventListener('click', (event) => {
  event.preventDefault();
  const nome = formEmail.elements['nome'].value;
  const email = formEmail.elements['email'].value;
  const check = formEmail.elements['concordar'].checked;

  if (!nome || !email || !check) {
    aviso.style.color = 'green';

    aviso.innerHTML = 'Prenchaa todos os campos';
    aviso.classList.add('ativo');
    return;
  }
  const dados = { nome, email };
  fetch('/api/capturaEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({ dados }),
  })
    .then((res) => {
      if (res.ok === true) {
        aviso.style.color = 'green';
        aviso.innerHTML = 'Email Adicionado a NewsLetter semanal';
        aviso.classList.add('ativo');
      }
    })
    .catch((error) => {
      aviso.innerHTML = 'Houve algum problema ao salvar seu Email';
      aviso.classList.add('ativo');
      console.log(error);
    });
});
