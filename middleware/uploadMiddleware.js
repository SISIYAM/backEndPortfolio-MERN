const multer = require("multer");
const path = require("path");

// configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "storage/images/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
