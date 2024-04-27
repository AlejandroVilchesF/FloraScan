/* Default Config Data*/
let template = {

    site: {
        /* Titulo corto del panel web */
        shortname: "GIE Panel v3",
        /* URL DLE BACKEND */
        apiurl: "/api", /* http://localhost:8091/api */
        /* URL DE NOTIFICACIONES PUSH */
        eventsurl: "/api/events/subscribe" /* http://localhost:8091/api/events/subscribe */
    },
    /* Key del superusuario */
    superuser: "Super Admin",
    /* Version del panel */
    panelVersion: '3.1.2'
}

module.exports = {
    template
}