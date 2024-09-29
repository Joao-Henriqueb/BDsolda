const admin = require('firebase-admin');
require('dotenv').config();

//ambiente dev
/*
const serviceAccount = require('./serviceAccountKey.json');
*/
//deploy

const serviceAccount = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
);

// Verifica se o Firebase já foi inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
  });
}

// Exporta o Firestore e o Storage
const db = admin.firestore();
const bucket = admin.storage().bucket();
module.exports = { db, bucket };
