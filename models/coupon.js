const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
        type: number,
    },
    percentage: {
        type: number,
    },
    maxDiscount:{
        type: Number,
        required: true,
    },
    userLimit:{
        type: Number,
        required: true,
    },
    minOrder:{
        type: Number,
        required: true,
    },
    validity:{
        type: Date,
        required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("coupon", couponSchema);
