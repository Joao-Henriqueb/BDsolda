const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
var admin = require('firebase-admin');
const firebase = require('firebase/app');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  STORAGE_BUCKET: process.env.STORAGE_BUCKET,
  MESSAGING_SENDER_ID: process.env.messagingSenderId,
  appId: process.env.APP_ID,
};
firebase.initializeApp(firebaseConfig);
const corsOptions = {
  origin: 'https://b-dsolda.vercel.app',
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
  storageBucket: process.env.STORAGE_BUCKET,
});
app.use(cors(corsOptions));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'client')));
app.use(cookieParser());
const db = admin.firestore();
const bucket = admin.storage().bucket();
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
