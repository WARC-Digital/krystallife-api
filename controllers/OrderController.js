const Order = require("../models/order");
const Product = require("../models/product");
const Counter = require("../models/counter");
const { StatusCodes } = require("http-status-codes");
const sendMail = require("../utils/mailer");
const {OrderStatus} = require('../utils/dictionaries');

const create = async (req, res) => {
  let data = req.body;
  console.log(req.body);
  let orderSubtotal = 0;
  data["orderItems"].forEach(async (element) => {
    let prod = await Product.findById(element.product);
    element.unitPrice = prod.price;
    element.subtotal = prod.price * element.quantity;
    orderSubtotal += element.subtotal;
    // console.log(element.subtotal);
    // console.log(orderSubtotal);
  });
  const counter = await Counter.find();
  console.log("Current Counter: ", counter);
  let orderCount = 1;
  if (counter.length > 0) {
    orderCount = counter[0].orderCount + 1;
  }
  data["orderId"] = "#" + genDateString() + orderCount;
  data["checkoutDate"] = new Date();
  data["deliveryStatus"] = 1;
  data["subTotal"] = orderSubtotal;
  data["totalAmount"] = orderSubtotal + 200;
  console.log(data);
  const order = await Order.create(data);
  if (counter.length > 0) {
    await Counter.findByIdAndUpdate(counter[0]._id, { orderCount });
  } else {
    await Counter.create({ orderCount });
  }

  sendMail(order.email, 'Order Confirmation' , `Your order is placed. The order ID is ${order.orderId}. Your order will be disbursed soon`);

  res.status(StatusCodes.CREATED).json({ order });
};

const edit = async (req, res) => {
  let data = req.body;
  console.log(data);
  let _id = data._id;
  delete data._id;

  await Order.findByIdAndUpdate(_id, data);
  let newThing = await Order.findById(_id);
  //console.log(newThing.deliveryStatus, OrderStatus);
  let newOrderStatus = OrderStatus[newThing.deliveryStatus];
  sendMail(newThing.email, 'Order STATUS updated' , `Your order status for OrderID ${newThing.orderId} has changed to ${newOrderStatus}`);

  console.log(newThing);
  return res
    .status(StatusCodes.OK)
    .json({ message: "update success", data: newThing });
};

const destroy = async (req, res) => {
  let id = req.params.id;
  let deleted = await Order.findByIdAndDelete(id);

  if (deleted) {
    return res
      .status(StatusCodes.OK)
      .json({ message: "delete success", data: deleted });
  }
  return res.status(StatusCodes.NOT_FOUND).json({ message: "delete failed" });
};

const getaAll = async (req, res) => {
  const orders = await Order.find().sort("-createdAt");
  // console.log(members)
  return res.json(orders);
};

const genDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = [year, month, day].join("");
  return dateStr;
};

module.exports = {
  getaAll,
  create,
  edit,
  destroy,
};
