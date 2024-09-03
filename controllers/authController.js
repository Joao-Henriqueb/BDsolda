var admin = require('firebase-admin');
exports.authenticateToken = async (req, res, next) => {
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
