const dbConfig = require("../config/config.js");
const mongoose = require("mongoose");

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.dburl;

///Modelos de la aplicacion
db.user = require("./user.model.js")(mongoose);
db.app = require("./app.model.js")(mongoose);
db.systemLog = require("./log.model.js")(mongoose);
db.album = require("./album.model")(mongoose);
db.planta = require("./planta.model")(mongoose);
db.enfermedad = require("./enfermedad.model")(mongoose);
db.etiqueta = require("./etiqueta.model")(mongoose);
db.roles = require("./user.roles.model")(mongoose);

module.exports = db;