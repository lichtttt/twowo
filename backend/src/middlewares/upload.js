const path = require('path');
const multer = require('multer');
const config = require('../config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../', config.uploadDir)),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

module.exports = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });