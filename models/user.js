const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      minlength: 3,
      maxlength: 50,
    },
    fname: {
      type: String,
      minlength: 3,
      maxlength: 50,
    },
    lname: {
      type: String,
      
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please Provide Valid Email",
      ],
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superuser"],
      default: "user",
    },
    phone: {
      type: String,
      required: [true, "Email is Required"],
      unique:true
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: 6,
    },

    city:{
      type: String,
    },
    district:{
      type: String,
    },
    address:{
      type: String,
    },
    zip:{
      type: String,
    }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
