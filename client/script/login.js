import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC6TON3zXSqWZcivWVxXvcbfjuLDB04Cic',
  authDomain: 'central-da-solda.firebaseapp.com',
  projectId: 'central-da-solda',
  storageBucket: 'central-da-solda.appspot.com',
  messagingSenderId: '163621077766',
  appId: '1:163621077766:web:47e655549c2269e3531487',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.querySelector('.login');
const entrar = document.querySelector('.entrar');
const aviso = document.querySelector('.aviso');

//loga usuario

async function login() {
  const email = loginForm.elements['email'].value;
  const password = loginForm.elements['password'].value;
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const token = await userCredential.user.getIdToken();
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        aviso.classList.add('ativo');
        aviso.innerHTML = res.message;
        console.log('erro de rede', error.message);
      } else {
        window.location.replace('/novopost');
      }
    })
    .catch((error) => {
      aviso.classList.add('ativo');
      aviso.innerHTML = 'Email ou senha incorreto!';
      console.log('erro no login', error.message);
    });
}
entrar.addEventListener('click', login);
