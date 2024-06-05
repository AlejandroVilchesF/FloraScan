//Imports
const db = require("../../models");
const { DEFAULT_APP, DEFAULT_ROLES, DEFAULT_USER, DEFAULT_PLANTS, DEFAULT_LABELS, DEFAULT_DISEASES } = require("../costants/default.data");

/****************************************/
/* FUNC: Inicializa normalmente el panel de configuración y la base de datos por defecto
*/
/**************************************/
async function checkDatabase() {
    try {
        console.log("Checking for App instance");
        let appInstance = await db.app.findOne();
        if(!appInstance || !appInstance.installed){
            console.log("App instance not found or not installed: Starting installation...")
            //Delete all instances
            await db.app.deleteMany({});
            await db.user.deleteMany({});
            await db.roles.deleteMany({});

            //Add default data
            await DEFAULT_APP.save();
            for await (const ROLE of DEFAULT_ROLES){
                await ROLE.save();
            }
            for await (const LABEL of DEFAULT_LABELS){
                await LABEL.save()
            }
            for await (const DISEASE of DEFAULT_DISEASES){
                await DISEASE.save();
            }
            for await (const PLANT of DEFAULT_PLANTS){
                await PLANT.save();
            }
            await DEFAULT_USER.save();
            console.log("Database has been reset to default values")
        }else{
            console.log("App instance already installed: no actions required")
        }
    } catch (err) {
        console.error("Seeder: checkDatabase")
        console.error(err);
    }
}


//Exportaciones 
module.exports = {
    checkDatabase
}
