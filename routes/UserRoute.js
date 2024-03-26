const express = require("express");
const router = express.Router();
const { updateUser, getUserByEmail } = require("../controllers/UserController");
const authenticateUser = require("../middleware/authentication");
const adminAuth = require("../middleware/adminAuth");

router.patch("/", authenticateUser, updateUser);
router.get("/getByEmail/:email", authenticateUser, adminAuth, getUserByEmail);

module.exports = router;
