const authController = require("../controllers/auth.controller.js");
const { auth } = require("../middleware");
const basePath = process.env.API_URL_BASE_PATH;
let router = require("express").Router();


module.exports = app => {
  // Login user
  router.post("/login", authController.login); // PUBLIC

  // Activate account 
  router.post("/activate", authController.activateAccount); // PUBLIC

  // Set recovery token
  router.put("/recovery/start", authController.setRecoveryToken); // PUBLIC

  // Check recovery token
  router.post("/recovery/check", authController.checkRecoveryToken); // PUBLIC

  // Logout user
  router.post("/logout", [auth.verifyToken], authController.logout); // PROTECTED

  /***************/
  app.use(
    basePath + "/auth",
    router);
};
