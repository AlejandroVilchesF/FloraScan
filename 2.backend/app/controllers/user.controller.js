const config = require('../config/config');
const User = require("../models/").user;
const Role = require("../models/").roles;
const { DEFAULT_APP, DEFAULT_ROLES, DEFAULT_USER, DEFAULT_SERVERS } = require("../config/costants/default.data");
const authContr = require('./auth.controller');
const SECTIONS = require("../config/costants/sections").sections;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PostLog = require('./system.log.controller').postLog;

exports.newAccount = async (req, res) => {
  try {
    // Super admin or User admin
    let isAdmin = isUserAdmin(res);
    // Super admin 
    let isSuper = isSuperAdmin(res);
    if (!req.body.info.nombre_usuario || !req.body.info.email || !req.body.info.password) {
      return res.status(400).send({ message: 'Peticion incompleta', code: 3000 });
    } else {
      // Super admin role can only be assigned by another super admin
      if(req.body.role == DEFAULT_ROLES[0]._id.toString() && !isSuper){
        return res.status(403).send({ message: 'No puedes conceder el rol de super usuario', code: 3000 });
      }
      const newUser = new User({
        info: {
          nombre_usuario: req.body.info.nombre_usuario,
          email: req.body.info.email,
          status: req.body.info.status != undefined && isAdmin? req.body.info.status : false,
          password: authContr.encryptPassword(req.body.info.password)
        },
        role: req.body.role && isAdmin? req.body.role : DEFAULT_ROLES[2]._id
      });
      try{
        await newUser.save();
        await PostLog('USER CREATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha creado un nuevo usuario: ${newUser.info.nombre_usuario}`, res.locals.tokenedUser._id);
        return res.status(200).send({ message: 'Usuario creado con exito', code: 2000 });
      }catch(saveError){
        if(saveError.code == 11000){
          return res.status(403).send({ message: 'El usuario ya existe', code: 3000 });
        }else{
          return res.status(403).send({ message: 'El usuario no se puede crear', code: 3000 });
        }
      }
    }
  } catch (err) {
    console.error("User controller: newAccount")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
}

exports.registerAccount = async (req, res) => {
  try {
    if (!req.body.info.nombre_usuario || !req.body.info.email || !req.body.info.password) {
      return res.status(400).send({ message: 'Peticion incompleta', code: 3000 });
    } else if (!req.body.info.email.includes("@")) {
      return res.status(400).send({ message: 'Email con formato incorrecto', code: 3000 });
    } else {
      const newUser = new User({
        info: {
          nombre_usuario: req.body.info.nombre_usuario,
          email: req.body.info.email,
          status: false,
          password: authContr.encryptPassword(req.body.info.password)
        },
        role: DEFAULT_ROLES[2]._id
      });
      try{
        await newUser.save();
        // Create activation token
        let token = jwt.sign({ 
          _id: newUser._id, 
          email: newUser.info.email, 
          name: newUser.info.nombre_usuario, 
          role: newUser.role
        }, config.secret, { expiresIn: 1800 });

        newUser.activation = token;
        await newUser.save();
        await PostLog('ACCOUNT REGISTER', `El usuario ${newUser.info.nombre_usuario} se ha registrado`, newUser._id);
        return res.status(200).send({ message: 'Usuario creado con exito', code: 2000 });
      }catch(saveError){
        if(saveError.code == 11000){
          return res.status(403).send({ message: 'El usuario ya existe', code: 3000 });
        }else{
          console.log("hola");
          return res.status(403).send({ message: 'El usuario no se puede crear', code: 3000 });
        }
      }
    }
  } catch (err) {
    console.error("User controller: registerAccount");
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    if (!req.body.id || !req.body.recovery || !req.body.password) {
      return res.status(400).send({ message: 'Peticion incompleta', code: 3000 });
    } else {
      if(req.body.id == DEFAULT_USER._id.toString()){
        return res.status(403).send({ message: 'Accion prohibida', code: 3000 });
      }
      const FindUser = await User.findOne({ _id: req.body.id });
      if(!FindUser){
        return res.status(403).send({ message: 'El usuario no existe', code: 3000 });
      }
      // try {
      //   await jwt.verify(req.body.recovery, config.secret);
      // }
      // catch (error) {
      //   return res.status(403).send({ message: 'Recovery expired', code: 3000 });
      // }
      // if(FindUser.recovery != req.body.recovery){
      //   return res.status(403).send({ message: 'Recovery error', code: 3000 });
      // }

      // Action permitted
      await User.updateOne({ _id: req.body.id }, { 'info.password': authContr.encryptPassword(req.body.password), recovery: null });
      await PostLog('PASSWORD RESET', `El usuario ${FindUser.info.nombre_usuario} ha cambiado su contraseña`, FindUser._id);
      return res.status(200).send({ message: 'Password successfully updated', code: 2000 });
    }
  } catch (err) {
    console.error("User controller: resetPassword");
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
}

exports.update = async (req, res) => {
  try {
    // Super admin or User admin
    let isAdmin = isUserAdmin(res);
    // Super admin 
    let isSuper = isSuperAdmin(res);
    // User ID
    let targetId = req.params.id;
    // User data to update
    let userdata = req.body.data;
    // User assigned role (check)
    let assignedRole = isAdmin? userdata.role : null;
    // User assigned status (check)
    let assignedStatus = isAdmin? userdata.info.status : undefined;

    // Default user can only be modified by themselves
    if(targetId == DEFAULT_USER._id.toString() && res.locals.tokenedUser._id != DEFAULT_USER._id.toString()){
      return res.status(403).send({ message: 'No puedes modificar el usuario por defecto', code: 3000 });
    }

    // Super admin role can only be assigned by another super admin
    if(assignedRole == DEFAULT_ROLES[0]._id.toString() && !isSuper){
      return res.status(403).send({ message: 'El rol super admin no se puede conceder', code: 3000 });
    }

    //User to update
    const targetUser = await User.findOne({ _id: targetId });

    if(!targetUser){
      return res.status(200).send({message: 'Usuario no encontrado', code: 3000});
    }

    // If user to update is super admin can only be modified by another super admin
    if(targetUser && targetUser.role._id == DEFAULT_ROLES[0]._id.toString() && !isSuper){
      return res.status(403).send({ message: 'El usuario super admin no se puede modificar', code: 3000 });
    }
    
    // User assigned name
    let assignedName =  userdata.info.nombre_usuario;
    // User assigned email
    let assignedEmail = userdata.info.email;
    if(assignedEmail != targetUser.info.email && !isAdmin){
      return res.status(403).send({ message: 'El email no se puede modificar', code: 3000 });
    }
    // User asigned avatar
    let assignedAvatar = userdata.info.avatar;
    // User asigned bio
    let assignedBio = userdata.info.bio;

    // Check password
    if(userdata.info.password && req.body.oldpassword){
      let passwordIsValid = await bcrypt.compareSync(req.body.oldpassword, targetUser.info.password);
      if(!passwordIsValid){
        return res.status(403).send({ message: 'Contraseña incorrecta', code: 3000 });
      }
    }
    // User assignad password
    let assignedPassword = userdata.info.password ? authContr.encryptPassword(userdata.info.password) : targetUser.info.password

    // If we get no role into the request it means the role won't change
    if (!assignedRole) {
      assignedRole = targetUser.role;
    }
    // If we get no status into the request it means the status won't change
    if (assignedStatus == undefined) {
      assignedStatus = targetUser.info.status;
    }

    // If we get no avatar into the request it means the avatar won't change
    if (!assignedAvatar) {
      assignedAvatar = targetUser.info.avatar;
    }

    // If we get no bio into the request it means the bio won't change
    if (!assignedBio) {
      assignedBio = targetUser.info.bio;
    }

    // Update data schema
    let updateSchema = {
      role: assignedRole,
      info: {
        email: assignedEmail,
        nombre_usuario: assignedName,
        status: assignedStatus,
        password: assignedPassword,
        avatar: assignedAvatar,
        bio: assignedBio,
        lastAccess: targetUser.info.lastAccess
      }
    };
    try{
      // Execute update and return updated user
      const updatedUser = await User.findOneAndUpdate( { _id: targetId }, updateSchema, { new: true }).populate('role');
      if(updatedUser._id.toString() != res.locals.tokenedUser._id.toString()){
        await PostLog('USER UPDATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha actualizado el usuario: ${updatedUser.info.nombre_usuario}`, res.locals.tokenedUser._id);
      }else{
        await PostLog('SELF UPDATE', `El usuario ${updatedUser.info.nombre_usuario} ha actualizado su informacion`, updatedUser._id);
      }
      return res.status(200).send({ message: 'Usuario actualizado con exito', data: updatedUser, code: 2000 });
    }catch(updateError){
      if(updateError.code == 11000){
        return res.status(403).send({ message: 'El nombre de usuario o el email no pueden estar duplicados', code: 3000 });
      }else{
        return res.status(403).send({ message: updateError.message, code: 3000 });
      }
    }
  } catch (err) {
    console.error("User controller: update ")
    console.error(err)
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
}

exports.findById = async (req, res) => {
  try {
    let findUser = await User.findOne({ _id: req.params.id }).populate('role');
    if (findUser) {
      return res.status(200).send({data: findUser, code: 2001});
    } else {
      return res.status(200).send({message: 'Usuario no encontrado', code: 3000});
    }
  } catch (err) {
    console.error("User controller: findById")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
}

exports.findUsers = async (req, res) => {
  try {
    let serverParams = {};
    let findParams = {};
    let sortParams = {_id: 1};
    if (req.headers.serverParams || req.headers.serverparams) {
      serverParams = JSON.parse(req.headers.serverParams ? req.headers.serverParams : req.headers.serverparams);
      let limit = serverParams.perPage;
      let offset = limit * (serverParams.page - 1);
      const userCount = await User.countDocuments({});
      const foundUsers = await User.find(findParams).populate('role').sort(sortParams).skip(offset).limit(limit);
      if(foundUsers && foundUsers.length > 0){
        let response = {
          data: foundUsers,
          totalRecords: userCount
        };
        return res.status(200).send({data: response, code: 2001});
      } else {
        return res.status(200).send({message: 'No se encontraron usuario', code: 3000});
      }

    } else {
      return res.status(400).send({ message: 'Peticion incompleta', code: 3000 });
    }
  } catch (err) {
    console.error("User controller: findAll")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};


exports.delete = async (req, res) => {
  try {
    // Super admin 
    let isSuper = isSuperAdmin(res);
    if(req.params.id == DEFAULT_USER._id.toString()){
      return res.status(403).send({message: 'El usuario por defecto no se puede eliminar', code: 3000});
    }else{
      const userToDelete = await User.findOne({ _id: req.params.id });
      if(userToDelete && userToDelete.role == DEFAULT_ROLES[0]._id.toString() && !isSuper){
        return res.status(403).send({ message: 'No se puede eliminar un usuario con el rol super admin', code: 3000 });
      }
      const deletedUser = await User.findOneAndDelete({ _id: req.params.id });
      await PostLog('USER DELETE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha eliminado el usuario: ${deletedUser.info.nombre_usuario}`, res.locals.tokenedUser._id);
      return res.status(200).send({ message: 'Usuario eliminado con exito', data: deletedUser, code: 2000 });
    }
  } catch (err) {
    console.error("User controller: delete")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.deleteSelf = async (req, res) => {
  try {
    const id = res.locals.tokenedUser._id;
    if(id == DEFAULT_USER._id.toString()){
      return res.status(403).send({message: 'El usuario por defecto no se puede eliminar', code: 3000});
    }else{
      await User.deleteOne({ _id: id });
      await PostLog('SELF DELETE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha eliminiado su cuenta`, null);
      return res.status(200).send({ message: 'Cuenta elminiada con exito', code: 2000 });
    }
  } catch (err) {
    console.error("User controller: delete")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    let findRoles = await Role.find({});
    if (findRoles && findRoles.length > 0) {
      return res.status(200).send({data: findRoles, code: 2001});
    } else {
      return res.status(200).send({message: 'No se han encontrado roles', code: 3000});
    }
  } catch (err) {
    console.error("User controller: getAllRoles")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.createRole = async (req, res) => {
  try {
    if(!req.body.alias){
      return res.status(400).send({ message: 'Peticion incompleta', code: 3000 });
    }
    const newRole = new Role({
      alias: req.body.alias,
      actions: []
    });
    try{
      await newRole.save();
      await PostLog('ROLE CREATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha creado un nuevo rol: ${newRole.alias}`, res.locals.tokenedUser._id);
      return res.status(200).send({ message: 'Rol creado con exito', code: 2000 });
    }catch(saveError){
      if(saveError.code == 11000){
        return res.status(403).send({ message: 'Ese rol ya existe', code: 3000 });
      }else{
        return res.status(500).send({ message: 'Error al crear el rol', code: 3000 });
      }
    }
  } catch (err) {
    console.error("User controller: createRole")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.updateRole = async (req, res) => {
  try {
    if(!req.body.alias){
      return res.status(400).send({ message: 'Peticion incompleta', code: 3000 });
    }
    let targetId = req.params.id;

    if(targetId == DEFAULT_ROLES[0]._id.toString()){
      return res.status(403).send({ message: 'No se puede modificar el rol super admin', code: 3000 });
    }

    if(req.body.actions && Array.isArray(req.body.actions) && req.body.actions.includes('ADMIN')){
      return res.status(403).send({ message: 'Accion prohibida', code: 3000 });
    }

    let updateSchema = {
      alias: req.body.alias,
      actions: req.body.actions && Array.isArray(req.body.actions)? req.body.actions: []
    }
    try{
      // Execute update and return updated role
      const updatedRole = await Role.findOneAndUpdate( { _id: targetId }, updateSchema, { new: true });
      await PostLog('ROLE UPDATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha actualizado el rol: ${updatedRole.alias}`, res.locals.tokenedUser._id);
      return res.status(200).send({ message: 'Rol actualizado con exito', data: updatedRole, code: 2000 });
    }catch(updateError){
      if(updateError.code == 11000){
        return res.status(403).send({ message: 'El alias del rol no puede estar repetido', code: 3000 });
      }else{
        return res.status(403).send({ message: updateError.message, code: 3000 });
      }
    }
  } catch (err) {
    console.error("User controller: updateRole")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    let targetId = req.params.id;
    if(targetId == DEFAULT_ROLES[0]._id.toString() || targetId == DEFAULT_ROLES[2]._id.toString()){
      let role = targetId == DEFAULT_ROLES[0]._id.toString()? 'Super admin' : 'User';
      return res.status(403).send({ message: `El ${role} no se puede eliminar`, code: 3000 });
    }else{
      await User.updateMany({ role: targetId },{ role: DEFAULT_ROLES[2]._id.toString() });
      const deletedRole = await Role.findOneAndDelete({ _id: targetId });
      await PostLog('ROLE DELETE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha eliminado el rol: ${deletedRole.alias}`, res.locals.tokenedUser._id);
      return res.status(200).send({ message: 'Rol eliminado con exito', data: deletedRole, code: 2000 });
    }
  } catch (err) {
    console.error("User controller: deleteRole")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.getSections = async (req, res) => {
  try {
    return res.status(200).send(SECTIONS);
  } catch (err) {
    console.error("User controller: getSections")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};


function isUserAdmin(res){
  // Petitioner user
  const tokenedUser = res.locals?.tokenedUser;
  let isAdmin = false;
  // Super admin or User admin
  if (tokenedUser && tokenedUser.role && (tokenedUser.role._id == DEFAULT_ROLES[0]._id.toString() || tokenedUser.role.actions?.includes("USER_ADMIN"))) {
    isAdmin = true;
  }
  return isAdmin;
};


function isSuperAdmin(res){
  // Petitioner user
  const tokenedUser = res.locals?.tokenedUser;
  let isSuper = false;
  // Super admin 
  if (tokenedUser && tokenedUser.role && (tokenedUser.role._id == DEFAULT_ROLES[0]._id.toString())) {
    isSuper = true;
  }
  return isSuper;
};

exports.saveUserLocalStorage = async (req, res) => {
  try{
      const petitioner = res.locals.tokenedUser;
      await User.updateOne({_id: petitioner._id}, { localStorage: req.body});
      return res.status(200).send('OK');
  }catch(err){
      console.error("Misc controller::Error saveUserLocalStorage");
      console.error(err);
      return res.status(500).send("Error");
  }
}