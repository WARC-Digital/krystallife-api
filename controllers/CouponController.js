const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const CouponUsage = require("../models/couponUsage");


const create = async (req, res) => {
  let data = req.body;
  console.log(req.body);

  const coupon = Coupon.create(data);

  res.status(StatusCodes.CREATED).json({ coupon });
};

const edit = async (req, res) => {
  let data = req.body;
  console.log(data);
  let _id = data._id;
  delete data._id;
  await Coupon.findByIdAndUpdate(_id, data);
  let newThing = await Coupon.findById(_id);
  console.log(newThing);
  return res
    .status(StatusCodes.OK)
    .json({ message: "update success", data: newThing });
};

const destroy = async (req, res) => {
  let id = req.params.id;
  let deleted = await Coupon.findByIdAndDelete(id);

  if (deleted) {
    return res
      .status(StatusCodes.OK)
      .json({ message: "delete success", data: deleted });
  }
  return res.status(StatusCodes.NOT_FOUND).json({ message: "delete failed" });
};

const getaAll = async (req, res) => {

const coupons = await Coupon.find().sort("-createdAt active");;
  
  return res.json({data:coupons});
};


const calculateDiscount = async(req, res)=>{
    let data = req.body;
    console.log(data);
   

    let result = await this.calculateDiscountByCoupon(req,data['couponCode'], data['amount']);
    return res.status(200).json(result);
}

const calculateDiscountByCoupon = async(req, code, amount)=>{
    let userId = req.user.userID;
    const user =  await User.findById(userId);
    const coupon = await Coupon.findOne({name:code, active:true});
    if(!coupon){
        return {error:true, msg:`Invalid Coupon`};
    }
    const usage = CouponUsage.findOne({email:user.email, couponCode:code})
    if(user.role == 'user'){
        if(usage && usage.usage >= coupon.useLimit){
            return {error:true, msg:"Usage Limit Exceeded"}
        }

        if (amount< coupon.minOrder){
            return {error:true, msg:`Minimum Order Amount Not Met. Please order ateast of BDT ${coupon.minOrder}`}
        }
        if(new Date()> coupon.validity){
            return {error:true, msg:`Coupon Validity Expired`};
        }
    }

    if(usage){
        await CouponUsage.findByIdAndUpdate(usage._id,{usage:usage.usage+1});
    }else{
        await CouponUsage.create({usage:1,email:user.email,couponCode:code});
    }

    discount = 0;

    if(coupon.percentage != 0){
        discount = amount *(coupon.percentage/100.0);
    }else if(coupon.amount != 0){
        discount = amount;
    }

    if(discount> coupon.maxDiscount){
        discount = coupon.maxDiscount;
    }

    return {error:false, discount:discount};

}

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
  calculateDiscount,
  calculateDiscountByCoupon,
};
