const { auth } = require("../middleware");
const events = require("../controllers/events.controller");
const basePath = process.env.API_URL_BASE_PATH;
var router = require("express").Router();


module.exports = app => {

    // Devuelve el listdo de datagramas
    router.get("/subscribe", events.subscribe);


    app.use(basePath + "/events", 
    //[auth.verifyToken], 
    router);
};