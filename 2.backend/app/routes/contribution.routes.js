const contributionController = require("../controllers/contribution.controller.js");
const { auth } = require("../middleware/index.js");
const basePath = process.env.API_URL_BASE_PATH;
let router = require("express").Router();


module.exports = app => {

router.post("/newplant", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_SELF") }], contributionController.newPlant);

  /***************/
  app.use(
    basePath + "/contribution",
    router);
};