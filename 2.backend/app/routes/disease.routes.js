const diseaseController = require("../controllers/disease.controller.js");
const { auth } = require("../middleware/index.js");
const basePath = process.env.API_URL_BASE_PATH;
let router = require("express").Router();


module.exports = app => {

  //Metodo para obtener todas las rutas
  router.post("/newDisease", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "DETAILS_SEE", true) }], diseaseController.newDisease);
  
  /***************/
  app.use(
    basePath + "/disease",
    router);
};