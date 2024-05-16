const Plant = require("../models").planta;
const PostLog = require('./system.log.controller').postLog;

// Método de inserccion de planta
exports.newPlant = async (req, res) => {
    try {
        //Control en el backend de los campos obligatorios
        if (!req.body.cientificName || !req.body.family || !req.body.genus || !req.body.image || !req.body.ubication) {
            return res.status(400).send({ message: 'Peticion incompleta', code: 3000 });
        }
        //Creacion del objeto planta a guardar
        const newPlant = new Plant({
            nombre_cientifico: req.body.cientificName,
            nombre_comun: req.body.commonName ? req.body.commonName : "",
            ubicacion: { latitud: req.body.ubication[0], longitud: req.body.ubication[1] },
            familia: req.body.family,
            genero: req.body.genus,
            descripcion: req.body.description ? req.body.description : "",
            imagenes: req.body.image
        });
        //Try catch para controlar la accion con la base de datos
        try {
            await newPlant.save();
            await PostLog('PLANT CREATE', `El usuario ${res.locals.tokenedUser.info.nombre_usuario} ha creado una nueva planta: ${newPlant.nombre_cientifico}`, res.locals.tokenedUser._id);
            return res.status(200).send({ message: 'Planta creada con exito', code: 2000 });
        } catch (saveError) {
            if (saveError.code == 11000) {
                return res.status(403).send({ message: 'La planta ya existe', code: 3000 });
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

exports.getPlant = async (req , res) => {
    try {
        let findPlant = await Plant.findOne({ nombre_cientifico: req.params.cientificName });
        if (findPlant) {
          return res.status(200).send({data: findPlant, code: 2001});
        } else {
          return res.status(200).send({message: 'Planta no encontrada', code: 3001});
        }
      } catch (err) {
        console.error("Plant Contoller: getPlant")
        console.error(err);
        return res.status(500).send({ message: 'Error', code: 3000 });
      }
};

exports.findByField = async (req , res) => {
    try {
        let field=req.params.field;
        let keyword=req.params.keyword;
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
        if (Array.isArray(results) && results.length > 0){
            return res.status(200).send({data: results, code: 2001});
        }
        //En caso que no sea una array, significa que se ha buscado por especie
        if (!Array.isArray(results) && results){
            //Se transforma en una array el resultado unico para ser tratado de la misma forma en el front
            return res.status(200).send({data: [results], code: 2001}); 
        }
        //Si se llega a este return significa que no se ha encontrado nada
        return res.status(200).send({message: 'Planta no encontrada', code: 3001});
      } catch (err) {
        console.error("Plant Contoller: findByField")
        console.error(err);
        return res.status(500).send({ message: 'Error', code: 3000 });
      }
};