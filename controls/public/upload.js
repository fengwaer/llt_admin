const multer = require('multer');
const path = require('path');

// 配置存储选项
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 指定文件保存的目录
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // 文件名
  }
});

const upload = multer({ storage: storage });

module.exports = upload;