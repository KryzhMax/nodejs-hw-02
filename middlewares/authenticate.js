const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SECRET_KEY } = process.env;
const { errorReq } = require("../helpers");

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(errorReq(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token) next(errorReq(401));

    req.user = user;
    next();
  } catch (error) {
    next(errorReq(401, error.message));
  }
};

module.exports = authenticate;
