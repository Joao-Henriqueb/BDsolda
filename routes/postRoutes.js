var express = require('express');
var router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const authController = require('../controllers/authController');

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

router.post(
  '/upload',
  authController.authenticateToken,
  upload.single('imgIntro'),
  (req, res) => {
    console.log(req.body);
    //console.log(req.file);
  },
);

module.exports = router;
