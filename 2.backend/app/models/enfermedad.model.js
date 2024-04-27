module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        nombre_cientifico : { 
            type: String,
            trim: true,
            unique:true,
            required: true,
            validate: {
              validator: function(value) {
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
    const Enfermedad = mongoose.model("enfermedades", schema);
    return Enfermedad;
  };