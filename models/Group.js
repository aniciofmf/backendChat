const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupTypes = ["public", "private", "invisible"];

const groupSchema = new Schema(
  {
    groupName: {
      type: String,
      required: true,
      index: true
    },

    groupType: {
      type: String,
      index: true,
      required: true,
      enum: groupTypes
    },

    userCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    membersTotal: { type: Number, default: 0 },
    image: String,
    enabled: { type: Boolean, default: true }
  },
  { versionKey: false, timestamps: true }
);

groupSchema.statics.isValidType = function(type) {
  if (!groupTypes.includes(type)) {
    return false;
  }

  return true;
};

module.exports = mongoose.model("Group", groupSchema);
