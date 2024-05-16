const plantController = require("../controllers/plant.controller.js");
const { auth } = require("../middleware/index.js");
const basePath = process.env.API_URL_BASE_PATH;
let router = require("express").Router();


module.exports = app => {

  //Crear una nueva planta
  router.post("/newplant", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_SEE") }], plantController.newPlant);
  //Encontrar por nombre cientifico
  router.get("/getplant/:cientificName", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_SEE", true) }], plantController.getPlant);
  //Encontrar por campo clave
  router.get("/findfield/:keyword/:field", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_SEE", true) }], plantController.findByField);

  /***************/
  app.use(
    basePath + "/plant",
    router);
};