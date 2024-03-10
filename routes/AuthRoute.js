const express = require("express");
const router = express.Router();
const { login, register, reqOTP,userLogin} = require("../controllers/AuthController");


router.post("/register", register);
router.post("/login", login);
router.post("/requestAuth", reqOTP);
router.post("/userlogin", userLogin);


module.exports = router;