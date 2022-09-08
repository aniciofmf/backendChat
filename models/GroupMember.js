const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupMemberState = ["accepted", "pending"];

const groupMemberSchema = new Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      index: true
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    state: {
      type: String,
      index: true,
      enum: groupMemberState
    },
    owner: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true }
  },
  { versionKey: false, timestamps: true }
);



module.exports = mongoose.model("GroupMember", groupMemberSchema);
