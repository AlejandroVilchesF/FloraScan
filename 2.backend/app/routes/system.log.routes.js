const SystemLogController = require("../controllers/system.log.controller.js");
const { auth } = require("../middleware");
const basePath = process.env.API_URL_BASE_PATH;
let router = require("express").Router();


module.exports = app => {

  // PROTECTED ENDPOINTS - PANEL_ADMIN
  router.get("/get", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "PANEL_ADMIN") }], SystemLogController.getLogs);

  /***************/
  app.use(
    basePath + "/logs",
    router);
};