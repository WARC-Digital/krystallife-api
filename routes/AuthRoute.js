const express = require("express");
const router = express.Router();
const { login, register, reqOTP,userLogin, checkAdmin} = require("../controllers/AuthController");
const authenticateUser = require("../middleware/authentication");
const adminAuth = require("../middleware/adminAuth");

router.post("/register", register);
router.post("/login", login);
router.post("/requestAuth", reqOTP);
router.post("/userlogin", userLogin);
router.get('/checkAdmin',authenticateUser,adminAuth, checkAdmin);


module.exports = router;