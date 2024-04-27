module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        nombre_etiqueta : { 
            type: String,
            trim: true,
            required: true,
            validate: {
              validator: function(value) {
                return value.trim().length > 0;
              },
              message: 'El nombre de la etiqueta no puede estar vacio'
            }
          },
          descripcion: String,
      },
      { versionKey: false, timestamps: true }
    );
    const Etiqueta = mongoose.model("etiquetas", schema);
    return Etiqueta;
  };