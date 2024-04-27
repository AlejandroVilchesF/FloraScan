const { ObjectId } = require("bson");
const App = require("../../models").app;
const Role = require("../../models").roles;
const User = require("../../models").user;

const DEFAULT_APP = new App({
    _id: new ObjectId("64a7ebd7be35add2b8c8ac4f"),
    installed: true
});

const DEFAULT_ROLES = [
    new Role({
        _id: new ObjectId("64b1232c7ee71eadf30f3343"),
        alias: "Super Admin",
        actions: ["ADMIN"]
    }),
    new Role({
        _id: new ObjectId("64b1232c7ee71eadf30f3344"),
        alias: "Admin",
        actions: [
            "USER_SELF", 
            "USER_SEE", 
            "USER_ADMIN", 
            "PANEL_ADMIN"
        ]
    }),
    new Role({
        _id: new ObjectId("64b1232c7ee71eadf30f3345"),
        alias: "User",
        actions: [
            "USER_SELF"
        ]
    })
];

const DEFAULT_USER = new User({
    _id: new ObjectId("64b1232c7ee71eadf30f3346"),
    info: {
        nombre_usuario: "Alejandro",
        email: "a@a.com",
        password: "$2b$08$arC8rAs4GWtlgWpyz5m9SOwDzZP9DOOg/L9PIK/cQLHzpsMASbFS.",
        status: true
    },
    role: new ObjectId("64b1232c7ee71eadf30f3343"),
})

module.exports = {
    DEFAULT_APP,
    DEFAULT_USER,
    DEFAULT_ROLES
}