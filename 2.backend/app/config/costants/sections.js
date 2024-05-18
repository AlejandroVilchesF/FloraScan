const SECTIONS = [
    {
        name: "Identificacion",
        binary: true,
        actions: {
            see: { keyword: "IDENTIFY_SEE" },
            admin: { keyword: "IDENTIFY_ADMIN" }
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
    {
        name: "Contribucion",
        binary: true,
        actions: {
            see: { keyword: "CONTRIBUTION_SEE" },
            admin: { keyword: "CONTRIBUTION_ADMIN" }
        }
    },
    {
        name: "Busqueda",
        binary: true,
        actions: {
            see: { keyword: "SEARCH_SEE" },
            admin: { keyword: "SEARCH_ADMIN" }
        }
    }
];


module.exports = {
    sections: SECTIONS
}