const { UnauthenticatedError} = require("../errors");

const adminAuth = async (req, res, next) => {
  if(!req.user || !req.user.role ){
    throw new UnauthenticatedError("You are not authorized to Login");
  }
  else if(req.user.role == 'user'){
    throw new UnauthenticatedError("You are not authorized to Login");
  }
  else{
    next();
  }
};

module.exports = adminAuth;