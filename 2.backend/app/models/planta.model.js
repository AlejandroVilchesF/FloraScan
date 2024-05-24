module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      nombre_cientifico: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate: {
          validator: function (value) {
            return value.trim().length > 0;
          },
          message: "El nombre cientifico no puede estar vacio",
        },
      },
      nombre_comun: String,
      ubicacion: [
        {
          latitud: { type: Number },
          longitud: { type: Number },
          fecha: { type: Date, default: Date.now }
        }
      ],
      familia: String,
      genero: String,
      descripcion: String,
      imagenes: [Object],
      enfermedades: [{ type: mongoose.Schema.ObjectId, ref: "enfermedades" }],
      etiquetas: [{ type: mongoose.Schema.ObjectId, ref: "etiquetas" }],
      temperaturas:[Object]
    },
    { versionKey: false, timestamps: true }
  );

  // Hook para convertir las cadenas de texto a minúsculas antes de guardar
  schema.pre('save', function(next) {
    this.nombre_cientifico = this.nombre_cientifico.toLowerCase();
    this.nombre_comun = this.nombre_comun.toLowerCase();
    this.familia = this.familia.toLowerCase();
    this.genero = this.genero.toLowerCase();
    next();
  });

  const Planta = mongoose.model("plantas", schema);
  return Planta;
};
