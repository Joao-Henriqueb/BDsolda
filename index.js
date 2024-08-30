const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
var admin = require('firebase-admin');
const firebase = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  STORAGE_BUCKET: process.env.storageBucket,
  MESSAGING_SENDER_ID: process.env.messagingSenderId,
  appId: process.env.APP_ID,
};
firebase.initializeApp(firebaseConfig);

const corsOptions = {
  origin: 'https://b-dsolda.vercel.app/',
  methods: 'GET,POST',
  optionsSuccessStatus: 200,
};

//deploy e esse

const serviceAccount = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
);

//ambiente dev e esse
/*
const serviceAccount = require('./serviceAccountKey.json');
*/
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
app.use(cors(corsOptions));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'client')));
app.use(cookieParser());

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    // Usuário não autenticado, permitir acesso à página de login
    if (req.path === '/login') {
      return next();
    }
    // Redirecionar para login se tentar acessar outras rotas
    return res.redirect('/login');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    if (req.path === '/login') {
      return res.redirect('/novopost');
    }
    next();
  } catch (error) {
    res.redirect('/login');
    //return res.status(403).json({ message: 'token inválido' });
  }
};
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/index.html'));
});

app.get('/controledepurga', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/controledepurga.html'));
});

app.get('/sobre', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/sobre.html'));
});
app.get('/artigos', (req, res) => {
  admin
    .firestore()
    .collection('posts')
    .get()
    .then((snapshot) => {
      const artigos = snapshot.docs.map((doc) => ({
        ...doc.data().intro,
        uid: doc.id,
        data: doc.data().data,
      }));

      res.render('artigos', { posts: artigos });
    });
});

app.get('/artigo/:id', (req, res) => {
  const id = req.params.id;

  admin
    .firestore()
    .collection('posts')
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let artigo = doc.data();
        let entryMeta = `<div class="entryMeta">
        <span>${artigo.data}</span>
        <span>${artigo.intro.autor}</span>
        <span>${artigo.intro.categoryTag}</span>
         </div>`;
        let palavra = '</h1>';

        let posicao = artigo.conteudo.indexOf('</h1>');
        let posicaopalavra = posicao + palavra.length;
        let newArtigo =
          artigo.conteudo.slice(0, posicaopalavra) +
          entryMeta +
          artigo.conteudo.slice(posicaopalavra);
        console.log(newArtigo);
        res.render('artigo', { newArtigo });
      } else {
        res.status(404).send('documento não encontrado');
      }
    })
    .catch((error) => {
      console.error('Erro ao puxar o post:', error);
      res.status(500).send('Erro ao puxar o post');
    });
});
app.get('/login', authenticateToken, async (req, res) => {
  const page = req.params.page;
  console.log(page);
  res.sendFile(path.join(__dirname, 'pages/login.html'));
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tentar fazer login com email e senha
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const token = await userCredential.user.getIdToken();
    // Retornar o token de autenticação ao cliente
    res.cookie('authToken', token, {
      httpOnly: true, // Impede o acesso ao cookie via JavaScript
      secure: true, // Envia o cookie apenas em conexões HTTPS
      maxAge: 3600000, // 1 hora
    });
    res.redirect('/novopost');
  } catch (error) {
    // Retornar erro em caso de falha no login
    console.log(error.message);
    res.status(401).json({ error: error.message });
  }
});

app.get('/novopost', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/novopost.html'));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('SERVER RUNNING PORT 5000');
});
