const express = require("express");
const router = express.Router();
var multer = require("multer");
const {  getaAll,create,edit, destroy, } = require("../controllers/ProductController");
const authenticateUser = require("../middleware/authentication");
const adminAuth = require("../middleware/adminAuth");
var path = require('path');
let n = 0;

// Set storage engine
const storage = multer.diskStorage({
    destination: "./public/images/product",
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + (++n) +Date.now() + path.extname(file.originalname)
      );
    },
  });
  
  // Init upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Limit file size to 10MB
  }).single("img");

router.route('/').get(getaAll).post(authenticateUser,adminAuth,upload,create).put(authenticateUser,adminAuth,upload,edit);
router.delete('/:id',authenticateUser,destroy)
module.exports = router;