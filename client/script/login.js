const loginForm = document.querySelector('.login');
const entrar = document.querySelector('.entrar');
const aviso = document.querySelector('.aviso');

//loga usuario

async function login() {
  const email = loginForm.elements['email'].value;
  const password = loginForm.elements['password'].value;
  try {
    const res = await fetch('https://b-dsolda.vercel.app/login', {
      headers: { 'Content-type': 'application/json;charset=UTF-8' },
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      window.location.replace('https://b-dsolda.vercel.app/novopost');
    } else {
      aviso.classList.add('ativo');
      console.log('Email ou senha incorreta');
    }
  } catch (error) {
    aviso.classList.add('ativo');
    console.log('erro catch');
    console.log(error);
  }
}
entrar.addEventListener('click', login);
