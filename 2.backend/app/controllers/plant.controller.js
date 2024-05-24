const Plant = require("../models").planta;
const PostLog = require('./system.log.controller').postLog;

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