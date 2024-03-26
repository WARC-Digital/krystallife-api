const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItem = new Schema({
  product: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },
  orderType: {
    type: String,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderschema = new Schema(
  {
    orderId: {
      type: String,
      required: false,
      unique: true,
    },
    checkoutDate: {
      type: Date,
      required: true,
    },

    deliveryDate: {
      type: Date,
      required: false,
    },

    deliveryStatus: {
      type: Number,
      required: true,
    },

    // Amount Area
    subTotal: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: false,
    },
    discount: {
      type: Number,
      required: false,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    orderItems: [orderItem],
    // User Address

    name: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    alternativePhoneNo: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    district: {
      type: String,
      required: false,
    },
    area: {
      type: String,
      required: false,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    coupon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderschema);
