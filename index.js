const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const corsOptions = {
  origin: 'http://b-dsolda.vercel.app',
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
