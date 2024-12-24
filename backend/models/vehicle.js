const mongoose = require("mongoose");
const User = require("./user");
const { Schema } = mongoose;

const vehicleSchema = new mongoose.Schema({
    vehicleDomain: {
        type: String,
        required: true
    },
    vehicleName: {
        type: String,
        required: true
    },
    vehicleModel: {
        type: String,
        required: true
    },
    batteryCapacity: {
        type: String,
        required: true
    },
    currentCapacity: {
        type: String
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle