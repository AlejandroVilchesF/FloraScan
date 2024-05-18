const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require("../models").user;
const { DEFAULT_APP, DEFAULT_ROLES, DEFAULT_USER, DEFAULT_SERVERS } = require("../config/costants/default.data");
const PostLog = require('../controllers/system.log.controller').postLog;

verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  // Verify token is valid and not expired
  try {
    await jwt.verify(token, config.secret);
  }
  catch (error) {
    return res.status(401).send({ message: 'Sesion caducada', code: 3000 });
  }

  // Verify the token belongs to any user
  const userDB = await User.findOne({ token: token }).populate('role');
  if (!userDB) {
    return res.status(401).send({ message: 'Esta sesion ha sido cerrada', code: 3000 });
  } else {
    res.locals.tokenedUser = userDB;
  }
  // Go to the next middleware
  return next();
};

authRoute = async (req, res, next, allowedActions, self) => {
  // Petitioner user
  const tokenedUser = res.locals.tokenedUser;
  // Super admin role directly grants access to the endpoint
  if (tokenedUser.role && tokenedUser.role._id == DEFAULT_ROLES[0]._id.toString()) {
    return next();
  }

  // If the petitioner role has the specified action, grant access to the endpoint
  if ((tokenedUser.role.actions).includes(allowedActions)) {
    return next();
  } else {
    // If the self flag is true, the ID on the parameters matches the ID of the petitioner user, 
    // and the petitioner posseses USER_SELF action, grant access to the endpoint
    if (self && req.params.id == tokenedUser._id && (tokenedUser.role.actions).includes("USER_SELF")) {
      return next();
    } else {
      // Unauthorized request
      // Remove user token
      let token = req.headers["x-access-token"];
      await User.updateOne({ _id: tokenedUser._id }, { $pull: { token: token } });
      await PostLog('PERMISSION VIOLATION', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha intentado hacer una accion no permitida`, res.locals.tokenedUser._id);
      return res.status(401).send({ message: "Peticion no permitida", code: 3000 });
    }
  }
};

/** EXPORTACIONES PÚBLICAS **/
/***************************/
module.exports = {
  verifyToken,
  authRoute
}