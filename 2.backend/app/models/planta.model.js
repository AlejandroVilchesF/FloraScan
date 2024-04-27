module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        nombre_cientifico : { 
            type: String,
            trim: true,
            unique: true,
            required: true,
            validate: {
              validator: function(value) {
                return value.trim().length > 0;
              },
              message: 'El nombre cientifico no puede estar vacio'
            }
          },
          nombre_comun: String,
          ubicacion: String,
          familia: String,
          genero: String,
          descripcion: String,
          imagenes:[Object],
          enfermedades:[{ type: mongoose.Schema.ObjectId, ref: "enfermedades" }],
          etiquetas:[{ type: mongoose.Schema.ObjectId, ref: "etiquetas" }]
      },
      { versionKey: false, timestamps: true }
    );
    const Planta = mongoose.model("plantas", schema);
    return Planta;
  };