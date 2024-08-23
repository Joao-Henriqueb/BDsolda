const express = require('express');
const { initializeApp } = require('firebase-admin/app');
const app = express();

var admin = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.get('/artigos', (req, res) => {
  admin
    .firestore()
    .collection('posts')
    .get()
    .then((snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }));
      console.log(
        posts.map((post) => {
          console.log(post.intro);
        }),
      );
      res.json(posts);
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
        console.log(doc.data());
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log('SERVER RUNNING PORT 5000');
});
