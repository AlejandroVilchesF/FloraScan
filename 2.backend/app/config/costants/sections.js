const SECTIONS = [
    {
        name: "Restringido",
        binary: true,
        actions: {
            see: { keyword: "PRIVATE_SEE" },
            admin: { keyword: "PRIVATE_ADMIN" }
        }
    },
    {
        name: "Perfil",
        binary: false,
        actions: { admin: { keyword: "USER_SELF" } }
    },
    {
        name: "Usuarios",
        binary: true,
        actions: {
            see: { keyword: "USER_SEE" },
            admin: { keyword: "USER_ADMIN" }
        }
    },
    {
        name: "Log del sistema",
        binary: false,
        actions: { admin: { keyword: "PANEL_ADMIN" } }
    },
];


module.exports = {
    sections: SECTIONS
}