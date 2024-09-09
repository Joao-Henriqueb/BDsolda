const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const cors = require('cors');
require('dotenv').config();

//ambiente dev e esse
/*
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  STORAGE_BUCKET: process.env.STORAGE_BUCKET,
  MESSAGING_SENDER_ID: process.env.messagingSenderId,
  appId: process.env.APP_ID,
};
firebase.initializeApp(firebaseConfig);

const serviceAccount = require('./serviceAccountKey.json');
*/

const corsOptions = {
  origin: 'https://b-dsolda.vercel.app',
  methods: 'GET,POST',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'client')));
app.use(cookieParser());

//rotas
const getRoutes = require('./routes/getRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/api', postRoutes);
app.use('/', getRoutes);

const PORT = process.env.PORT || 5000;
module.exports = app;

app.listen(PORT, () => {
  console.log('SERVER RUNNING PORT 5000');
});
