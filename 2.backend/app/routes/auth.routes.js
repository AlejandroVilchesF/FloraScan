const authController = require("../controllers/auth.controller.js");
const { auth } = require("../middleware");
const basePath = process.env.API_URL_BASE_PATH;
let router = require("express").Router();


module.exports = app => {
  // Login user
  router.post("/login", authController.login); // PUBLIC

  // Logout user
  router.post("/logout", [auth.verifyToken], authController.logout); // PROTECTED

  /***************/
  app.use(
    basePath + "/auth",
    router);
};
