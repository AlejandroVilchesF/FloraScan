module.exports = mongoose => {
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
          message: 'El nombre cientifico no puede estar vacio'
        }
      },
      nombre_comun: String,
      descripcion: String,
      tratamiento: String,
    },
    { versionKey: false, timestamps: true }
  );
  // Hook para convertir las cadenas de texto a minúsculas antes de guardar
  schema.pre('save', function (next) {
    this.nombre_cientifico = this.nombre_cientifico.toLowerCase();
    this.nombre_comun = this.nombre_comun.toLowerCase();
    next();
  });

  const Enfermedad = mongoose.model("enfermedades", schema);
  return Enfermedad;
};