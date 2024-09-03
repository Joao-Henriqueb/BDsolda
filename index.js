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
  STORAGE_BUCKET: process.env.storageBucket,
  MESSAGING_SENDER_ID: process.env.messagingSenderId,
  appId: process.env.APP_ID,
};
firebase.initializeApp(firebaseConfig);

const corsOptions = {
  origin: '*',
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

//rotas
const getRoutes = require('./routes/getRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/', getRoutes);
app.use('/api', postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('SERVER RUNNING PORT 5000');
});

// separar rotas depois
