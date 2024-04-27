module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      token: [String], 
      info: {
        nombre_usuario: { 
          type: String,
          trim: true,
          unique: true,
          required: true,
          validate: {
            validator: function(value) {
              return value.trim().length > 0;
            },
            message: 'El nombre del usuario no puede estar vacio'
          }
        },
        email: {
          type: String,
          trim: true,
          unique: true,
          required: true,
          validate: {
            validator: function(value) {
              return value.trim().length > 0;
            },
            message: 'El email no puede estar vacio'
          }
        },
        password: String,
        lastAccess: Date,
        status: Boolean,
      },
      role: { type: mongoose.Schema.ObjectId, ref: "roles" },
      albumes: [{ type: mongoose.Schema.ObjectId, ref: "albumes" }],
      localStorage: Object,

    },
    { versionKey: false, timestamps: true }
  );
  const User = mongoose.model("usuarios", schema);
  return User;
};