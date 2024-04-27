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
    const findUser = await User.findOne({ $or: [{ 'info.name': LoginKey }, { 'info.email': LoginKey }] }).populate('role');
    let passwordIsValid = false
    // Check password
    if (findUser) {
      passwordIsValid = await bcrypt.compareSync(req.body.password, findUser.info.password);
    }

    if (!findUser || !passwordIsValid) {
      // If no dada or incorrect pasword -> wrong credentials
      return res.status(403).send({ message: 'Authentication failed', code: 3000 });
    }else if (!findUser.info.status){
      // If account is not active
      return res.status(403).send({ message: 'Your account is not activated', code: 3000 });
    } else {
      // Token list
      const CurrentTokenList = findUser.token? findUser.token : [];
      for (const ListedToken of CurrentTokenList){
        try {
          // Check each token expiration
          await jwt.verify(ListedToken, config.secret);
          //console.log('Valid token');
        }
        catch (error) {
          // Remove expired token
          //console.log('Expired token');
          await User.updateOne({ _id: findUser._id }, { $pull: { token: ListedToken } });
        }
      }

      // Create new token
      let token = jwt.sign({ 
        _id: findUser._id, 
        email: findUser.info.email, 
        name: findUser.info.name, 
        role: findUser.role
      }, config.secret, { expiresIn: req.body.duration? req.body.duration : 3600 });

      //Update user
      const userData = await User.findOneAndUpdate(
        { _id: findUser._id },
        { $push: { token: { $each: [token] } }},
        // Return new document
        { new: true } 
      ).populate('role');

      // response
      if (userData) {
        // Update last access
        userData.info.lastAccess = new Date();
        await userData.save();
        await PostLog('SYSTEM ACCESS', `User ${userData.info.nombre_usuario} has accessed the system`, userData._id);
        return res.status(200).send({user: userData, token: token});
      } else {
        return res.status(500).send({ message: 'Login error', code: 3000 });
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

    if(closeAllSessions){
      // Remove all tokens
      await User.updateOne({ _id: tokenedUser._id }, {  token: []  });
      return res.status(200).send({ message: 'All sessions successfully closed', code: 2000});
    }else{
      // Token to remove
      const token = req.headers["x-access-token"];
      //Update user
      await User.updateOne({ _id: tokenedUser._id }, { $pull: { token: token } });
      return res.status(200).send({ message: 'Session successfully closed', code: 2000});
    }
  } catch (err) {
    console.error("Auth controller: logout")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
}

async function activateAccount(req, res) {
  try{
    const activationToken = req.body.activation;
    let payload = null;
    try {
      payload = await jwt.verify(activationToken, config.secret);
    }
    catch (error) {
      return res.status(403).send({ message: 'Activation expired', code: 3000 });
    }
    const FindUser = await User.findOne({ _id: payload?._id });
    if(!FindUser || FindUser.activation != activationToken){
      return res.status(403).send({ message: 'Activation expired', code: 3000 });
    }
    await User.updateOne({_id: FindUser._id}, { 'info.status': true, activation: null });
    await PostLog('ACCOUNT ACTIVATION', `User ${FindUser.info.nombre_usuario} succesfully activated account`, FindUser._id);
    return res.status(200).send({ message: 'Account activated', code: 2000});
  } catch (err) {
    console.error("Auth controller: activateAccount")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
}

async function checkRecoveryToken(req, res) {
  try{
    const recoveryToken = req.body.recovery;
    let payload = null;
    try {
      payload = await jwt.verify(recoveryToken, config.secret);
    }
    catch (error) {
      return res.status(403).send({ message: 'Recovery expired', code: 3000 });
    }
    const FindUser = await User.findOne({ _id: payload?._id });
    if(!FindUser || FindUser.recovery != recoveryToken){
      return res.status(403).send({ message: 'Recovery expired', code: 3000 });
    }
    return res.status(200).send({ message: 'Recovery active', data: FindUser._id, code: 2001});
  } catch (err) {
    console.error("Auth controller: checkRecoveryToken")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
}

async function setRecoveryToken(req, res){
  try{
    const email = req.body.email;
    if(email === undefined){
      return res.status(400).send({ message: 'Incomplete request', code: 3000 });
    }
    const FindUser = await User.findOne({'info.email': email});
    if(!FindUser){
      return res.status(403).send({ message: 'Email not registered', code: 3000 });
    }
    if(FindUser.recovery){
      try {
        await jwt.verify(FindUser.recovery, config.secret);
        return res.status(403).send({ message: 'Password recovery already requested', code: 3000 });
      }catch (error) {}
    }
    // Create recovery token
    let token = jwt.sign({ 
      _id: FindUser._id, 
      email: FindUser.info.email, 
      name: FindUser.info.name, 
      role: FindUser.role
    }, config.secret, { expiresIn: 1800 });
    await User.updateOne({ _id: FindUser._id },{ recovery: token });
    try{
      await Mailer(
        'Bonodere - Password recovery',
        `Please follow this link to reset your password: https://bonodere.famluro.es/recover?token=${token}`,
        FindUser.info.email
      );
    }catch(mailerError){
      console.log(mailerError);
      return res.status(403).send({ message: 'Email does not exist', code: 3000 });
    }
    await PostLog('RECOVERY REQUEST', `User ${FindUser.info.name} requested password recovery`, FindUser._id);
    return res.status(200).send({ message: 'Recovery submited', code: 2000 });
  } catch (err) {
    console.error("Auth controller: setRecoveryToken")
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
  encryptPassword,
  activateAccount,
  checkRecoveryToken,
  setRecoveryToken
}
