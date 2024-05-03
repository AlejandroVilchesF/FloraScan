// VARIABLES
///////////////////////////////
const clients = []; //Array con los ids de los clientes


// Agregar cliente a las notificaciones
// Agregarlo a la lista de clientes subscritos para enviarle notificaciones
function addClient(client) {
    clients.push(client);
}


// Quitar clientes de la lista de notificaciones
// Si el cliente se ha desconectado quitarlo de la lista
function removeClient(client) {
    const index = clients.indexOf(client);
    if (index !== -1) {
        clients.splice(index, 1);
    }
}


// Evento de notificación
// eventData: Dato a enviar
// refEvent: Referencia del evento (para ver de qué es el evento)
exports.notifyClients = (eventData, refEvent) => {
    clients.forEach(client => {
      const combinedData = {
        eventData: eventData,
        refEvent: refEvent
      };
  
      client.write(`data: ${JSON.stringify(combinedData)}\n\n`);
    });
};

// Evento de subscripcion a eventos
/////////////////////////////////////
exports.subscribe = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Agregamos el cliente a la lista de notificaciones push
        addClient(res);

        // Al cerrar la conexión latente lo quitamos de la lista
        req.on('close', () => {
            removeClient(res);
        });

    } catch (error) {
        console.error(error);
        // Manejo de error
        return res.status(500).send({ message: "Ha ocurrido un error procesando su solicitud", code: 3000 });
    }
};