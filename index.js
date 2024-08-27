const express = require('express');
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
  origin: 'http://127.0.0.1:5501',
  methods: 'GET,POST',
  optionsSuccessStatus: 200,
};
//deploy e esse

const serviceAccount = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
);

/*
//ambiente dev e esse

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
      let introArtigos = [];
      const artigos = snapshot.docs.map((doc) => ({
        ...doc.data().intro,
        uid: doc.id,
        data: doc.data().data,
      }));

      res.render('artigos', { posts: artigos });
    });
});

app.get('/artigosPost/:id', (req, res) => {
  const id = req.params.id;
  admin
    .firestore()
    .collection('posts')
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.json({
          ...doc.data(),
        });
      } else {
        res.status(404).send('documento não encontrado');
      }
    })
    .catch((error) => {
      console.error('Erro ao puxar o post:', error);
      res.status(500).send('Erro ao puxar o post');
    });
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

    res.json({ token });
  } catch (error) {
    // Retornar erro em caso de falha no login
    console.log(error.message);
    res.status(401).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('SERVER RUNNING PORT 5000');
});
