const Order = require("../models/order");
const Product = require("../models/product");
const Counter = require("../models/counter");
const User = require("../models/user");
const {calculateDiscountByCoupon} = require("./CouponController");
const { StatusCodes } = require("http-status-codes");
//const sendMail = require("../utils/mailer");
const templateSendMail = require("../utils/templateMailer");
const {OrderStatus} = require('../utils/dictionaries');

const create = async (req, res) => {
  let data = req.body;
  console.log(req.body);
  let orderSubtotal = 0;
  const products = await Product.find();
  console.log(data["orderItems"]);

  data["orderItems"].forEach((element) => {
    let prod = products.find(item=>item._id == element.product );
    element.unitPrice = prod.price;
    element.subtotal = prod.price * element.quantity;
    orderSubtotal += element.subtotal;
    console.log(element.subtotal);
    console.log(orderSubtotal);
  });
  const counter = await Counter.find();
  console.log("Current Counter: ", counter);
  let orderCount = 1;
  if (counter.length > 0) {
    orderCount = counter[0].orderCount + 1;
  }
  data['discount'] = 0;
  if(data['coupon']){
    let result = await calculateDiscountByCoupon(req,data['coupon'],orderSubtotal);

    if(!result.error){
      data['discount'] = result.discout;
    }
  }

  data["orderId"] = "#" + genDateString() + orderCount;
  data["checkoutDate"] = new Date();
  data["deliveryStatus"] = 1;
  data["subTotal"] = orderSubtotal;
  data["shippingFee"] = 200;
  
  data["totalAmount"] = orderSubtotal + data["shippingFee"] - data["discount"];
  console.log(data);
  const order = await Order.create(data);
  if (counter.length > 0) {
    await Counter.findByIdAndUpdate(counter[0]._id, { orderCount });
  } else {
    await Counter.create({ orderCount });
  }

  //sendMail(order.email, 'Order Confirmation' , `Your order is placed. The order ID is ${order.orderId}. Your order will be disbursed soon`);
  templateSendMail('orderTemplate',`Order Confirmation - ${order.orderId}`,{title:'Thank You for your Order!',msg:'Thank you for your recent order We are pleased to confirm thar we have received your order and it is currently being processed.',order:order.toJSON(),products})

  const user = await User.findOne({email:data['email']})

  try{
    if(!user){
      let arr = data['name'].split(" ")
      await User.create({name:data['name'], role:'user',lname: arr[arr.length-1],fname:data['name'].replace(arr[arr.length-1],'').trim(),phone:data['phoneNo'],password:'123abc',zip:data['area'],city:data['city'],district:data['district'],address:data['shippingAddress'],email:data['email']  });
      console.log('New User Created with email:',data['email']);
    }

  }
  catch(err){
    console.log('Error Occured. User Could Not be Created. Only Saving Order.',err);
  }
  

  res.status(StatusCodes.CREATED).json({ order });
};

const edit = async (req, res) => {
  let data = req.body;
  console.log(data);
  let _id = data._id;
  delete data._id;
  const products = await Product.find();
  await Order.findByIdAndUpdate(_id, data);
  let newThing = await Order.findById(_id);
  //console.log(newThing.deliveryStatus, OrderStatus);
  let newOrderStatus = OrderStatus[newThing.deliveryStatus];
  let suffix='';
  if(newOrderStatus.includes)
  //sendMail(newThing.email, 'Order STATUS updated' , `Your order status for OrderID ${newThing.orderId} has changed to ${newOrderStatus}`);
  templateSendMail('orderTemplate',`Order Status Updated to ${newOrderStatus} - ${newThing.orderId}`,{title:'Your Order Status Updated!',msg:`Your Order Status has been updated to ${newOrderStatus}. ${suffix}`,order:newThing.toJSON(),products})

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
  let userId = req.user.userID;
  const user =  await User.findById(userId);

  let orders;

  if(user.role == 'user'){
     orders = await Order.find({email:user.email}).sort("-createdAt");
  }else{
     orders = await Order.find().sort("-createdAt");
  }


  
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
