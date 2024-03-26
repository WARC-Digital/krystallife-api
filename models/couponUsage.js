const mongoose = require("mongoose");
const couponUsageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    couponCode: {
        type: String,
        required: true,
    },
    usage: {
        type: Number,
        required:true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CouponUsage", couponUsageSchema);
