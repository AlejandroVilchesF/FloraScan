const plantController = require("../controllers/plant.controller.js");
const { auth } = require("../middleware/index.js");
const basePath = process.env.API_URL_BASE_PATH;
let router = require("express").Router();


module.exports = app => {

  //Crear una nueva planta
  router.post("/newplant", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "CONTRIBUTION_SEE") }], plantController.newPlant);
  //Encontrar por nombre cientifico
  router.get("/getplant/:scientificName", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "CONTRIBUTION_SEE", true) }], plantController.getPlant);
  //Encontrar por campo clave
  router.get("/findfield/:keyword/:field", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "CONTRIBUTION_SEE", true) }], plantController.findByField);
  //Obtener todos los nombres de las plantas
  router.get("/getNames/:field", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "CONTRIBUTION_SEE", true) }], plantController.getNames);
  
  /***************/
  app.use(
    basePath + "/plant",
    router);
};