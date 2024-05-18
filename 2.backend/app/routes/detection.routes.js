const detectionController = require("../controllers/detection.controller.js");
const { auth } = require("../middleware");
const basePath = process.env.API_URL_BASE_PATH;
let router = require("express").Router();


module.exports = app => {

router.post("/identify", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "IDENTIFY_SEE") }], detectionController.identify);

  /***************/
  app.use(
    basePath + "/detection",
    router);
};