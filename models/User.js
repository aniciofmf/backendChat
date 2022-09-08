const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      message: "Email duplicado",
      trim: true,
      lowercase:true
    },

    password: {
      type: String,
      required: true,
      trim: true
    },

    user: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    image: String,
    enabled: { type: Boolean, default: true },
    role: [String],
    type: String,
    lastLog: { type: Date, default: null },
    tokens: {
      userToken: {
        type: String
      },
      chatToken: {
        type: String
      }
    }
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
