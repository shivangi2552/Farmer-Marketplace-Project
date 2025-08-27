const multer = require('multer');
// const path = require('path');

// Save files to /uploads with unique names
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

module.exports = { upload };

