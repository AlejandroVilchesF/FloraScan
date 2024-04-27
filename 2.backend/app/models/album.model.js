module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        nombre_album: String,
        descripcion: String,
        portada: Object,
        plantas: [{type: mongoose.Schema.ObjectId, ref: "plantas"}]
      },
      { versionKey: false, timestamps: true }
    );
    const Album = mongoose.model("albumes", schema);
    return Album;
};