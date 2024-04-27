module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      app: {
        isEvent: Boolean
      },
      requestingData: Boolean,
      installed: {
        type: Boolean,
        default: false
      }
    },
    { versionKey: false, timestamps: true }
  );

  const App = mongoose.model("app", schema);
  return App;
};