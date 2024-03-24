const User = require("../models/user");

const updateUser = async (req, res) => {
  let data = req.body;
  console.log(data);
  let _id = data["_id"];
  delete data["_id"];

  if (req.user.userID != _id) {
    throw new UnauthenticatedError(
      "You are not authorized to access ths resource"
    );
  }

  await User.findByIdAndUpdate(_id, data);
  const newUser = await User.findById(_id);
  console.log(newUser);

  return res.status(200).json({ user: newUser });
};

const getUserByEmail = async (req, res) => {
  let data = req.body;
  console.log(data);
  let email = data["email"];

  const user = await User.find({ email });

  return res.status(200).json({ user: user });
};

module.exports = {
  updateUser,
  getUserByEmail,
};
