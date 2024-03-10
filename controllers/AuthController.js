const User = require("../models/user");
const OTP = require("../models/otp");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const otpGenerator = require("otp-generator");
const sendMail = require("../utils/mailer");

const register = async (req, res) => {
  console.log(req.body);
  let data = req.body;
  if (data["role"] && data["role"] == "superadmin_warc123abc") {
    data["role"] = "superuser";
  } else {
    data["role"] = "user";
  }

  const user = await User.create(data);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: user, token });
};

const login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please Provide Email and Password");
  }
  const user = await User.findOne({ email });
  //comparing password

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  if (user.role == "user") {
    throw new UnauthenticatedError("You are not authorized to login");
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: user, token });
};

const reqOTP = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({msg:'User Not Found'});
  }

  const otpCode = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  await OTP.deleteMany({ email });
  const otp = await OTP.create({ email, otp:otpCode });
  sendMail(
    email,
    `Authentication OTP - ${otpCode}`,
    `Dear User, <br> Your Authentication Code is  <br> <br>${otpCode}<br><br>Use this code to login. If you did not request a login code you can simply ignore this email.<br><br><br> Regards,<br> Krystallife Support`
  );

  res.status(StatusCodes.OK).json({msg:'OTP Sent'});
};

const userLogin = async (req, res) => {
  console.log(req.body);
  const { email, code } = req.body;
  const otp = await OTP.findOne({ email });
  console.log(otp);

  if(!otp){
    throw new UnauthenticatedError("You are not authorized to login");
  }
  if(code != otp.otp){
    throw new UnauthenticatedError("You are not authorized to login");
  }

  await OTP.deleteMany({ email });

  const user = await User.findOne({email})

 const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: user, token });
};

module.exports = {
  register,
  login,
  reqOTP,
  userLogin,
};
