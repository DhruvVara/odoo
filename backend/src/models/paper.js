const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    paperUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamp: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("user", userSchema);
