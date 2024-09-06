var express = require('express');
var router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); // Configurando multer para armazenar img  na memória
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const authController = require('../controllers/authController');
const { bucket, db } = require('../index');
const { v4: uuidv4 } = require('uuid'); // Para gerar nomes únicos para os arquivos

router.post('/login', async (req, res) => {
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
/*IMPORTANTE:::ao mudar ordem do formData.append do blob e do 
  img intro ira interferir no final
  NO FRONT END(EDITOR.JS)
  :::IMPORTANTE*/
function substituirSrc(linksImgs, html, imgIntro) {
  let imageIndex = 0;

  html = html.replace(/<img src="data:([^"]+)"/g, function (match) {
    const imageUrl = linksImgs[imageIndex];
    imageIndex++;
    return `<img src="${imageUrl}"`;
  });

  return html;
}
/*
router.post(
  '/upload',
  authController.authenticateToken,
  upload.any(),

  async (req, res) => {
    let { html, textoIntro, autor, titulo, data, categoryTag } = req.body;
    let linkIntro;
    let intro;

    if (!req.files) {
      return res.status(400).send('Nenhuma imagem foi recebida.');
    }

    try {
      // Iterando sobre todos os arquivos recebidos
      const uploadPromises = req.files.map(async (file, index) => {
        // Gerando um nome único para cada imagem no Firebase
        const uniqueFilename = `images/${uuidv4()}_${file.originalname}`;
        // Criando um objeto Blob para o Firebase a partir do buffer de memória
        const blob = bucket.file(uniqueFilename);

        // Preparando o stream de upload para o Firebase Storage
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });
        // Fazendo o upload da imagem
        blobStream.end(file.buffer);
        await new Promise((resolve, reject) => {
          blobStream.on('finish', async () => {
            try {
              await blob.makePublic();
              resolve();
            } catch (err) {
              reject(err);
            }
          });

          blobStream.on('error', (err) => {
            reject(err);
          });
        });
        // Retornando a URL pública da imagem
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;
        return publicUrl; // URL acessível publicamente
      });
      // Esperando que todos os uploads sejam concluídos
      const imageUrls = await Promise.all(uploadPromises);
      console.log('imagens salvas com sucesso');
      linkIntro = imageUrls.pop(); // remove ultimo item array que e da img intro
      const conteudo = substituirSrc(imageUrls, html); // substituir os src do html
      intro = { textoIntro, autor, titulo, linkIntro, categoryTag };
      const itensUpload = {
        conteudo,
        intro,
        data,
      };
      db.collection('posts')
        .add(itensUpload)
        .then((docRef) => {
          console.log('Documento adicionado com ID:', docRef.id);
        })
        .catch((error) => {
          console.error('Erro ao adicionar documento:', error);
        });
      //uploadPost(itensUpload);
    } catch (error) {
      console.error('Erro ao fazer uploads:', error);
    }
  },
);
*/
module.exports = router;
