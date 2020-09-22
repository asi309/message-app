const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const MONGO_DB_URI =
  'mongodb+srv://user_new:lV4uIAhDOYn44jHa@cluster0.9i27z.mongodb.net/messages?retryWrites=true&w=majority';

try {
  mongoose.connect(MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (error) {
  console.log(error);
}

const fileStorage = multer.diskStorage({
  destination: path.resolve(__dirname, 'images'),
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext);
    cb(null, `${filename}-${Date.now()}${ext}`);
  },
});

const fileFilter = function (req, file, cb) {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.resolve(__dirname, 'images')));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const { statusCode, message } = error;
  res.status(statusCode || 500).json({ message });
});

const server = app.listen(8080);
const io = require('./socket').init(server);
io.on('connection', socket => {
  console.log('Client Connected!')
});
