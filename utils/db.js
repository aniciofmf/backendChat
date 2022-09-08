const mongoose = require('mongoose');

function castStringToObjectId(string) {
    return mongoose.Types.ObjectId(string);
}

module.exports = {
    castStringToObjectId
};