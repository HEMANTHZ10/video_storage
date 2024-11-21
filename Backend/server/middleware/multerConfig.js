const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'videos', // Bucket name in MongoDB
      filename: `${Date.now()}-${file.originalname}`,
      metadata: { rollNumber: req.body.rollNumber }, // Save roll number
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files are allowed'), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
