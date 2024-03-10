const express = require("express");
const router = express.Router();
const { updateUser} = require("../controllers/UserController");
const authenticateUser = require("../middleware/authentication");

router.patch("/", authenticateUser,updateUser);




module.exports = router;