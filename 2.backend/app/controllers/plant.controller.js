const Plant = require("../models").planta;
const PostLog = require('./system.log.controller').postLog;
const { DEFAULT_ROLES } = require("../config/costants/default.data");

// Método de inserccion de planta
exports.newPlant = async (req, res) => {
  try {
    //Control en el backend de los campos obligatorios
    if (!req.body.scientificName || !req.body.family || !req.body.genus || !req.body.image || !req.body.ubication) {
      return res.status(400).send({ message: 'Peticion incompleta', code: 3000 });
    }
    //Creacion del objeto planta a guardar
    const newPlant = new Plant({
      nombre_cientifico: req.body.scientificName,
      nombre_comun: req.body.commonName ? req.body.commonName : "",
      ubicacion: { latitud: req.body.ubication[0], longitud: req.body.ubication[1] },
      familia: req.body.family,
      genero: req.body.genus,
      descripcion: req.body.description ? req.body.description : "",
      imagenes: req.body.image,
      temperaturas: req.body.temp
    });
    //Try catch para controlar la accion con la base de datos
    try {
      await newPlant.save();
      await PostLog('PLANT CREATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha creado una nueva planta: ${newPlant.nombre_cientifico}`, res.locals.tokenedUser._id);
      return res.status(200).send({ message: 'Planta creada con exito', code: 2000 });
    } catch (saveError) {
      if (saveError.code == 11000) {
        const resultado = newExtraInfo(req.body.scientificName, req.body.ubication[0], req.body.ubication[1], req.body.image);
        if (resultado) {
          await PostLog('PLANT UPDATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha modificado la planta: ${newPlant.nombre_cientifico}`, res.locals.tokenedUser._id);
          return res.status(200).send({ message: `Se han agregado la ubicacion y la imagen a ${req.body.scientificName}`, code: 2000 });
        }
        return res.status(403).send({ message: 'Hubo un error al actualizar la planta', code: 3000 });
      } else {
        return res.status(403).send({ message: 'La planta no se pudo crear', code: 3000 });
      }
    }
  } catch (error) {
    console.error("Plant Contoller: newPlant")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};
async function newExtraInfo(nombre_cientifico, latitud, longitud, imagen) {
  try {
    let findPlant = await Plant.findOne({ nombre_cientifico: nombre_cientifico });
    if (findPlant) {
      findPlant.ubicacion.push({ latitud: latitud, longitud: longitud });
      findPlant.imagenes.push(imagen);
      findPlant.save();
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
  }
}
exports.getPlant = async (req, res) => {
  try {
    let findPlant = await Plant.findOne({ nombre_cientifico: req.params.scientificName }).populate("enfermedades").populate("etiquetas");
    if (findPlant) {
      return res.status(200).send({ data: findPlant, code: 2001 });
    } else {
      return res.status(200).send({ message: 'Planta no encontrada', code: 3001 });
    }
  } catch (err) {
    console.error("Plant Contoller: getPlant")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.findByField = async (req, res) => {
  try {
    let field = req.params.field;
    let keyword = req.params.keyword;
    let results;
    if (field === "nombre_cientifico") {
      // Buscamos el documento que contenga la cadena buscada en el campo "nombre_cientifico"
      results = await Plant.findOne({ nombre_cientifico: { $regex: keyword, $options: 'i' } });
    } else {
      // Buscamos todos los documentos que contengan la cadena buscada en el campo especificado
      let query = {};
      //Creamos un objeto con la query de forma dinamica
      query[field] = { $regex: keyword, $options: 'i' };
      results = await Plant.find(query);
    }

    //Controlamos el caso que el resultado devuelto haya sido una array (Se ha buscado por familia o genero)
    if (Array.isArray(results) && results.length > 0) {
      return res.status(200).send({ data: results, code: 2001 });
    }
    //En caso que no sea una array, significa que se ha buscado por especie
    if (!Array.isArray(results) && results) {
      //Se transforma en una array el resultado unico para ser tratado de la misma forma en el front
      return res.status(200).send({ data: [results], code: 2001 });
    }
    //Si se llega a este return significa que no se ha encontrado nada
    return res.status(200).send({ message: 'Planta no encontrada', code: 3000 });
  } catch (err) {
    console.error("Plant Contoller: findByField")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.getNames = async (req, res) => {
  try {
    // Encuentra todas las plantas por el campo especificado y las ordena alfabeticamente
    let plants = await Plant.find().select(req.params.field).sort({ [req.params.field]: 1 });

    if (plants.length > 0) {
      return res.status(200).send({ data: plants, code: 2001 });
    } else {
      return res.status(200).send({ message: 'No se encontraron plantas', code: 3001 });
    }
  } catch (err) {
    console.error("Plant Controller: getNames");
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.insertLabels = async (req, res) => {
  try {

    let plant = await Plant.findOne({ nombre_cientifico: req.body.scientificName });

    if (plant) {
      plant.etiquetas = req.body.idLabels;
      await plant.save();
      await PostLog('PLANT UPDATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha modificados las etiquetas de la planta: ${plant.nombre_cientifico}`, res.locals.tokenedUser._id);
      return res.status(200).send({ message: 'Etiquetas actualizadas correctamente', code: 2000 });
    } else {
      return res.status(200).send({ message: 'No se encontraron plantas con ese nombre', code: 3000 });
    }
  } catch (err) {
    console.error("Plant Controller: insertLabels");
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.addDisease = async (req, res) => {
  try {

    let plant = await Plant.findOne({ nombre_cientifico: req.body.nombre_cientifico });

    if (plant) {
      plant.enfermedades.push(req.body.id_enfermedad);
      await plant.save();
      await PostLog('PLANT UPDATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha agregado una enfermedad a la planta: ${plant.nombre_cientifico}`, res.locals.tokenedUser._id);
      return res.status(200).send({ message: 'Enfermedad actualizadas correctamente', code: 2000 });
    } else {
      return res.status(200).send({ message: 'No se encontraron plantas con ese nombre', code: 3000 });
    }
  } catch (err) {
    console.error("Plant Controller: addDisease");
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.findByLabel = async (req, res) => {
  try {
    let plants = await Plant.find({ etiquetas: req.params.id }).populate("enfermedades").populate("etiquetas");
    if (plants.length > 0) {
      return res.status(200).send({ data: plants, code: 2001 });
    } else {
      return res.status(200).send({ message: 'Planta no encontrada', code: 3000 });
    }
  } catch (err) {
    console.error("Plant Contoller: findByLabel")
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.deleteByName = async (req, res) => {
  try {

    if (!isUserAdmin(res)){
      return res.status(404).send({ message: 'No tiene permisos para realizar esta accion', code: 3000 });
    }
    
    // Encuentra y elimina la planta por su nombre
    let plant = await Plant.findOneAndDelete({ nombre_cientifico: req.params.nombre_cientifico });

    // Si no se encuentra la planta, devuelve un mensaje
    if (!plant) {
      return res.status(200).send({ message: 'Planta no encontrada', code: 3000 });
    } else {
      //Si se se encuentra y elimina se crea el log correspondiente
      await PostLog('PLANT DELETE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha eliminado la planta: ${plant.nombre_cientifico}`, res.locals.tokenedUser._id);
      return res.status(200).send({ message: 'Planta eliminada', code: 2000 });
    }
  } catch (err) {
    console.error("Plant Controller: deleteByName");
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.updatePlantInfo = async (req, res) => {
  try {

    if (!isUserAdmin(res)){
      return res.status(404).send({ message: 'No tiene permisos para realizar esta accion', code: 3000 });
    }

    // Encuentra y elimina la planta por su nombre
    let plant = await Plant.findOne({ _id: req.params.id });

    if (req.body.nombre_cientifico == "" || req.body.familia == "" || req.body.genero == ""){
      return res.status(200).send({ message: 'Peticion incompleta', code: 3000 });
    }

    // Si no se encuentra la planta, devuelve un mensaje
    if (!plant) {
      return res.status(200).send({ message: 'Planta no encontrada', code: 3000 });
    }
    
    plant.nombre_cientifico=req.body.nombre_cientifico;
    plant.nombre_comun=req.body.nombre_comun;
    plant.familia=req.body.familia;
    plant.genero=req.body.genero;
    plant.descripcion=req.body.descripcion;
    plant.save();

    await PostLog('PLANT UPDATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha modificado la planta: ${plant.nombre_cientifico}`, res.locals.tokenedUser._id);
    return res.status(200).send({ message: 'Planta Actualizada', code: 2000 });
  } catch (err) {
    console.error("Plant Controller: updatePlantInfo");
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.removeDisease = async (req, res) => {
  try {

    if (!isUserAdmin(res)){
      return res.status(404).send({ message: 'No tiene permisos para realizar esta accion', code: 3000 });
    }

    const plantId = req.params.plantId; // ID de la planta
    const diseaseId = req.params.diseaseId; // ID de la enfermedad a eliminar

    // Encuentra la planta y elimina la enfermedad del array de enfermedades
    const result = await Plant.findByIdAndUpdate(
      plantId,
      { $pull: { enfermedades: diseaseId } },
      { new: true } // Devuelve el documento actualizado
    );

    // Si no se encuentra la planta, devuelve un mensaje
    if (!result) {
      return res.status(404).send({ message: 'Planta no encontrada', code: 3000 });
    }

    await PostLog('PLANT UPDATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha eliminado una enfermedad de la planta: ${result.nombre_cientifico}`, res.locals.tokenedUser._id);
    return res.status(200).send({ message: 'Enfermedad eliminada de la planta', code: 2000 });
  } catch (err) {
    console.error("Plant Controller: removeDisease");
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.updateTemps = async (req, res) => {
  try {

    if (!isUserAdmin(res)){
      return res.status(404).send({ message: 'No tiene permisos para realizar esta accion', code: 3000 });
    }

    // Encuentra la planta
    const result = await Plant.findOne({_id:req.params.id});

    // Si no se encuentra la planta, devuelve un mensaje
    if (!result) {
      return res.status(404).send({ message: 'Planta no encontrada', code: 3000 });
    }

    //Si encontramos la planta actualizamos sus temperaturas a las nuevas
    result.temperaturas=req.body.temperaturas;
    result.save();
    await PostLog('PLANT UPDATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha actualizado las temperaturas de la planta: ${result.nombre_cientifico}`, res.locals.tokenedUser._id);
    return res.status(200).send({ message: 'Temperaturas actualizadas', code: 2000 });
  } catch (err) {
    console.error("Plant Controller: updateTemps");
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

exports.removePicture = async (req, res) => {
  try {
    const plantId = req.body.id; // ID de la planta
    const image = req.body.imagen; // Imagen a eliminar

    if (!isUserAdmin(res)){
      return res.status(404).send({ message: 'No tiene permisos para realizar esta accion', code: 3000 });
    }

    // Encuentra la planta y elimina la imagen del array de imagenes
    const result = await Plant.findByIdAndUpdate(
      plantId,
      { $pull: { imagenes: image } },
      { new: true } // Devuelve el documento actualizado
    );

    // Si no se encuentra la planta, devuelve un mensaje
    if (!result) {
      return res.status(404).send({ message: 'Planta no encontrada', code: 3000 });
    }

    await PostLog('PLANT UPDATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha eliminado una imagen de la planta: ${result.nombre_cientifico}`, res.locals.tokenedUser._id);
    return res.status(200).send({ message: 'Imagen eliminada', code: 2000 });
  } catch (err) {
    console.error("Plant Controller: removePicture");
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

function isUserAdmin(res){
  // Petitioner user
  const tokenedUser = res.locals?.tokenedUser;
  let isAdmin = false;
  // Super admin or User admin
  if (tokenedUser && tokenedUser.role && (tokenedUser.role._id == DEFAULT_ROLES[0]._id.toString() || tokenedUser.role.actions?.includes("DETAILS_ADMIN"))) {
    isAdmin = true;
  }
  return isAdmin;
};