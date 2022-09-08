const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const settingSchema = new Schema(
{
    settingName: String,
    settingValue: String
});


module.exports = mongoose.model("Setting", settingSchema);
