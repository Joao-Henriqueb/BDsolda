var express = require('express');
var router = express.Router();
const path = require('path');
var admin = require('firebase-admin');
const authController = require('../controllers/authController');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/index.html'));
});

router.get('/artigos', (req, res) => {
  admin
    .firestore()
    .collection('posts')
    .orderBy('orderData', 'desc')
    .get()
    .then((snapshot) => {
      const artigos = snapshot.docs.map((doc) => ({
        ...doc.data().intro,
        uid: doc.id,
        data: doc.data().data,
      }));
      console.log(artigos);
      res.render('artigos', { posts: artigos });
    });
});
router.get('/artigo/:id', (req, res) => {
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
router.get('/controledepurga', (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/controledepurga.html'));
});

router.get('/sobre', (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/sobre.html'));
});

router.get('/login', authController.authenticateToken, async (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/login.html'));
});

router.get('/novopost', authController.authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/novopost.html'));
});

module.exports = router;
