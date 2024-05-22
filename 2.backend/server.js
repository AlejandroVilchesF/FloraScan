///////////////////
///// IMPORTS /////
///////////////////
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const app = express();
const seeder = require("./app/config/seeder/seeder");

///////////////////////
///// ENVIRONMENT /////
///////////////////////
const basePath = process.env.API_URL_BASE_PATH;
const PORT = process.env.API_PORT || 8081;

/////////////////////////
///// SERVES CONFIG /////
/////////////////////////
// Use CORS
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '50mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Welcome page
app.get(basePath, (req, res) => {
  res.json({ message: "Welcome to FloraScan" });
});

// Listener
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

//////////////////////////
///// DATABASE CHECK /////
//////////////////////////
db.mongoose
.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log("Connected to database " + db.url);
    seeder.checkDatabase();
})
.catch(err => {
    console.log("Cannot connect to the database!");
    console.log(err)
    process.exit();
});


//////////////////////
///// API ROUTES /////
//////////////////////
require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/system.log.routes")(app);
require("./app/routes/detection.routes")(app);
require("./app/routes/plant.routes")(app);
require("./app/routes/labels.routes")(app);
require("./app/routes/disease.routes")(app);