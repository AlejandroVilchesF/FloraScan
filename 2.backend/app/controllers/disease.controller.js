const Enfermedad = require("../models").enfermedad;
const PostLog = require('./system.log.controller').postLog;

exports.newDisease = async (req, res) => {
  try {
    //Control en el backend de los campos obligatorios
    if (!req.body.nombre_cientifico) {
      return res.status(400).send({ message: 'Peticion incompleta', code: 3000 });
    }
    //Creacion del objeto planta a guardar
    const newDisease = new Enfermedad({
      nombre_cientifico: req.body.nombre_cientifico,
      nombre_comun: req.body.nombre_comun ? req.body.nombre_comun : "",
      descripcion: req.body.descripcion ? req.body.descripcion : "",
      tratamiento: req.body.tratamiento ? req.body.tratamiento : ""
    });
    try {
      const infoDisease=await newDisease.save();
      await PostLog('DISEASE CREATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha creado una nueva enfermedad: ${newDisease.nombre_cientifico}`, res.locals.tokenedUser._id);
      return res.status(200).send({ message: 'Enfermedad creada con exito', code: 2000, data:infoDisease});
    } catch (saveError) {
      if (saveError.code == 11000) {
        const aux = await getDiseaseId(req.body.nombre_cientifico)
        return res.status(200).send({ message: 'La enfermedad ya existe', code: 2000, data:aux});
      } else {
        return res.status(403).send({ message: 'La enfermedad no se pudo crear', code: 3000 });
      }
    }
  } catch (err) {
    console.error("Disease Contoller: newDisease");
    console.error(err);
    return res.status(500).send({ message: 'Error', code: 3000 });
  }
};

async function getDiseaseId(nombre_enfermedad){
  try {
    let enfermedad = await Enfermedad.findOne({nombre_cientifico: nombre_enfermedad});
    if (enfermedad){
      return enfermedad._id
    }
    return null;
  } catch (error) {
    console.error("Disease Contoller: getDiseaseId");
    return null;
  }
}