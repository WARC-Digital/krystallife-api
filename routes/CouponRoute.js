const express = require("express");
const router = express.Router();
const {
  getaAll,
  create,
  edit,
  destroy,
  calculateDiscount,
} = require("../controllers/CouponController");
const authenticateUser = require("../middleware/authentication");
const adminAuth = require("../middleware/adminAuth");

router
  .route("/")
  .get(authenticateUser, adminAuth, getaAll)
  .post(authenticateUser, adminAuth, create)
  .put(authenticateUser, adminAuth, edit);
router.delete("/:id", authenticateUser, adminAuth, destroy);
router.post("/calcDiscount", authenticateUser, calculateDiscount);
module.exports = router;
