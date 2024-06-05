//Importaciones e inicializaciones
const config = require('../config/config');
const User = require("../models").user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PostLog = require('./system.log.controller').postLog;


async function login(req, res) {
  try {
    // Login Key
    const LoginKey = req.body.key;
    // Find user by name or email and populate role
    const findUser = await User.findOne({ $or: [{ 'info.nombre_usuario': LoginKey }, { 'info.email': LoginKey }] }).populate('role');
    let passwordIsValid = false
    // Check password
    if (findUser) {
      passwordIsValid = await bcrypt.compareSync(req.body.password, findUser.info.password);
    }

    if (!findUser || !passwordIsValid) {
      // If no dada or incorrect pasword -> wrong credentials
      return res.status(403).send({ message: 'Fallo en la autenticacion', code: 3000 });
    } else if (!findUser.info.status) {
      // If account is not active
      return res.status(403).send({ message: 'Tu cuenta no esta activa', code: 3000 });
    } else {
      // Token list
      const CurrentTokenList = findUser.token ? findUser.token : [];
      for (const ListedToken of CurrentTokenList) {
        try {
          // Check each token expiration
          await jwt.verify(ListedToken, config.secret);
        }
        catch (error) {
          // Remove expired token
          await User.updateOne({ _id: findUser._id }, { $pull: { token: ListedToken } });
        }
      }

      // Create new token
      let token = jwt.sign({
        _id: findUser._id,
        email: findUser.info.email,
        name: findUser.info.nombre_usuario,
        role: findUser.role
      }, config.secret, { expiresIn: req.body.duration ? req.body.duration : 3600 });

      //Update user
      const userData = await User.findOneAndUpdate(
        { _id: findUser._id },
        { $push: { token: { $each: [token] } } },
        // Return new document
        { new: true }
      ).populate('role');

      // response
      if (userData) {
        // Update last access
        userData.info.lastAccess = new Date();
        await userData.save();
        await PostLog('SYSTEM ACCESS', `El usuario ${userData.info.nombre_usuario} ha accedido el sistema`, userData._id);
        return res.status(200).send({ user: userData, token: token });
      } else {
        return res.status(500).send({ message: 'Error en el login', code: 3000 });
      }
    }
  } catch (err) {
    console.error("Auth controller: login")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
}

async function logout(req, res) {
  try {
    // Petitioner user
    const tokenedUser = res.locals?.tokenedUser;
    // Global logount flag
    const closeAllSessions = req.body.closeAllSessions;

    if (closeAllSessions) {
      // Remove all tokens
      await User.updateOne({ _id: tokenedUser._id }, { token: [] });
      return res.status(200).send({ message: 'Todas las sesiones cerradas con exito', code: 2000 });
    } else {
      // Token to remove
      const token = req.headers["x-access-token"];
      //Update user
      await User.updateOne({ _id: tokenedUser._id }, { $pull: { token: token } });
      return res.status(200).send({ message: 'Sesion cerrada con exito', code: 2000 });
    }
  } catch (err) {
    console.error("Auth controller: logout")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
}

function encryptPassword(password) {
  return bcrypt.hashSync(password, 8);
}

//Exportaciones
module.exports = {
  login,
  logout,
  encryptPassword
}
