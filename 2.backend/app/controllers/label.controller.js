const Etiqueta = require("../models").etiqueta;

exports.getLabels = async (req , res) => {
    try {
        let findLabels = await Etiqueta.find({});
        if (findLabels.length > 0) {
          return res.status(200).send({data: findLabels, code: 2001});
        } else {
          return res.status(200).send({message: 'Etiquetas no encontradas', code: 3001});
        }
      } catch (err) {
        console.error("Label Contoller: getLabels")
        console.error(err);
        return res.status(500).send({ message: 'Error', code: 3000 });
      }
};