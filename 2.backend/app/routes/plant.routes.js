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
  //Insertar Etiquetas
  router.post("/insertLabels", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "DETAILS_SEE") }], plantController.insertLabels);
  //Insertar Enfermedades
  router.post("/addDisease", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "DETAILS_SEE") }], plantController.addDisease);
  //Encontrar plantas por etiquetas
  router.get("/findByLabel/:id", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "SEARCH_SEE", true) }], plantController.findByLabel);
  //Eliminar una planta por su nombre
  router.delete("/delete/:nombre_cientifico", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "DETAILS_ADMIN", true) }], plantController.deleteByName);
  //Eliminar una planta por su nombre
  router.put("/update/:id", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "DETAILS_ADMIN", true) }], plantController.updatePlantInfo);
  //Eliminar una enfermedad de una planta
  router.delete("/removeDisease/:plantId/:diseaseId", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "DETAILS_ADMIN", true) }], plantController.removeDisease);
  //Actualizar las temperaturas de una planta
  router.put("/updateTemps/:id", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "DETAILS_ADMIN", true) }], plantController.updateTemps);
  //Eliminar una imagen de una planta
  router.post("/removeImage", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "DETAILS_ADMIN", true) }], plantController.removePicture);

  /***************/
  app.use(
    basePath + "/plant",
    router);
};