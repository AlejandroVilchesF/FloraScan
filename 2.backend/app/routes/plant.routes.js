const plantController = require("../controllers/plant.controller.js");
const { auth } = require("../middleware/index.js");
const basePath = process.env.API_URL_BASE_PATH;
let router = require("express").Router();


module.exports = app => {

  router.post("/newplant", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_SEE") }], plantController.newPlant);
  router.get("/getplant/:cientificName", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_SEE", true) }], plantController.getPlant);

  /***************/
  app.use(
    basePath + "/plant",
    router);
};