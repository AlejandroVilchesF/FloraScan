module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        logType: String,
        log: String,
        user: { type: mongoose.Schema.ObjectId, ref: "usuarios" }
      },
      { versionKey: false, timestamps: true }
    );
    schema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
    const SystemLog = mongoose.model("system_logs", schema);
    return SystemLog;
};