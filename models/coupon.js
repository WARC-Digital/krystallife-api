const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true,
    },
    amount: {
        type: Number,
    },
    percentage: {
        type: Number,
    },
    maxDiscount:{
        type: Number,
        required: true,
    },
    useLimit:{
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
    },
    active:{
        type:Boolean,
        required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
