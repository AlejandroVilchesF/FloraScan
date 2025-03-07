const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Método de llamada a la API de identificación
exports.identify = async (req, res) => {
    try {
        // Constantes para la llamada a la API
        const PROJECT = 'all';
        const API_URL = `https://my-api.plantnet.org/v2/identify/${PROJECT}?api-key=`;
        const API_PRIVATE_KEY = '2b10DbvzqovkQ2LqXeLvmDj24';
        const API_SIMSEARCH_OPTION = '&include-related-images=true';
        const API_LANG = '&lang=es';

        // Llamada a la función de parseo de imagen
        const fileName = await parseImage(req.body.fileContent, req.body.fileName);

        // Constantes para la identificación
        const IMAGE = `/home/backend/app/data/${fileName}`;
        const ORGAN = req.body.flowerOrgan;

        // Crear objeto FormData
        let form = new FormData();
        form.append('organs', ORGAN);
        form.append('images', fs.createReadStream(IMAGE));

        // Realizar la solicitud a la API
        const { status, data } = await axios.post(
            API_URL + API_PRIVATE_KEY + API_SIMSEARCH_OPTION + API_LANG,
            form,
            {
                headers: form.getHeaders()
            }
        );
        //Si el codigo de respuesta es el 200 devolvemos los datos y borramos la imagen
        if (status === 200) {
            fs.unlink(IMAGE, (err) => {
                if (err) throw err;
                console.log(`${IMAGE} ha sido borrado`);
            });
            return res.status(200).send({ data:data.results, code: 2001 });
        } else {
            console.log(`${status}: No se ha conseguido completar la peticion`);
            return res.status(200).send({ data:data.results, code: 2001 });
        }

    } catch (error) {
        console.error('error', error);
        return res.status(200).send({message: 'Especie no encontrada', data:[], code: 3000 });
    }
};

// Función para parsear la imagen de Base64 a un archivo tipo jpg de nuevo
async function parseImage(content, fileName) {
    return new Promise((resolve, reject) => {
        // Obtener los datos base64
        const matches = content.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        const base64Data = matches[2];

        // Convertir los datos base64 en un buffer
        const buffer = Buffer.from(base64Data, 'base64');

        // Guardar el buffer en un archivo de imagen
        const file = `/home/backend/app/data/${fileName}`;
        fs.writeFile(file, buffer, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log('La imagen se ha guardado correctamente como', file);
                resolve(fileName);
            }
        });
    });
}