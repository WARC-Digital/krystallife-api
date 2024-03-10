const express = require("express");
const router = express.Router();
const {
  getaAll,
  create,
  edit,
  destroy,
} = require("../controllers/OrderController");
const authenticateUser = require("../middleware/authentication");
const adminAuth = require("../middleware/adminAuth");

router
  .route("/")
  .get(authenticateUser, getaAll)
  .post(create)
  .put(authenticateUser,adminAuth, edit);
router.delete("/:id", authenticateUser, adminAuth,destroy);
module.exports = router;
