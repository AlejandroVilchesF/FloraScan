module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        alias: { 
          type: String,
          trim: true,
          unique: true,
          required: true,
          validate: {
            validator: function(value) {
              return value.trim().length > 0;
            },
            message: 'El alias del role no puede estar vacio'
          }
        },
        actions: [String]
      },
      { versionKey:false, timestamps: true }
    );
  
    const Roles = mongoose.model("roles", schema);
    return Roles;
  };