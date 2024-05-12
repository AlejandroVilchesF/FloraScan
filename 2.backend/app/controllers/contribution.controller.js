const Plant = require("../models/").planta;
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
            imagenes: req.body.image.split(",")[1]
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
        console.error("Contribution controller: newPlant")
        console.error(err);
        return res.status(500).send({ message: 'Error', code: 3000 });
    }
};