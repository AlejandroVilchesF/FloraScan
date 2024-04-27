const { auth } = require("../middleware");
const user = require("../controllers/user.controller.js");
const basePath = process.env.API_URL_BASE_PATH;
let router = require("express").Router();

module.exports = app => {

  // USER PUBLIC ENDPOINTS
  router.post("/register", user.registerAccount);
  router.put("/password/reset", user.resetPassword);


  // USER PROTECTED ENDPOINTS (USER_SEE, USER_ADMIN)
  router.get("/data", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_SEE") }],  user.findUsers);
  router.get("/data/:id", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_SEE", true) }], user.findById);
  router.post("/create", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_ADMIN") }], user.newAccount);
  router.put("/data/:id", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_ADMIN", true) }], user.update);
  router.delete("/data/:id", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_ADMIN") }], user.delete);
  router.delete("/delete/self", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_SELF") }], user.deleteSelf);

  // ROLES PROTECTED ENDPOINTS (USER_SEE, USER_ADMIN)
  router.get("/roles",  [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_SEE") }], user.getAllRoles);
  router.post("/roles", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_ADMIN") }], user.createRole);
  router.put("/roles/:id", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_ADMIN") }], user.updateRole);
  router.delete("/roles/:id", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_ADMIN") }], user.deleteRole);
  router.get("/sections", [auth.verifyToken, function (res, req, next) { auth.authRoute(res, req, next, "USER_SEE") }], user.getSections);

  // USER TOKENED ENDPOINT
  router.post("/localstorage", [ auth.verifyToken ], user.saveUserLocalStorage);
  /***************/
  app.use(
    basePath + "/user",
    router);
};
