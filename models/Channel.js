const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const channelSchema = new Schema(
  {
    channelNameId: {
      type: String,
      required: true,
      index: true
    },

    channelName: {
      type: String,
      required: true
    },

    channelType: {
      type: String,
      default: null
    },

    channelGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    },

    channelMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    image: String,
    enabled: { type: Boolean, default: true },
    dateCreation: { type: Date, default: Date.now },
    userCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Channel", channelSchema);
