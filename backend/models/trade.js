const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    typeOfPost: { type: Number, enum: [1, 2], required: true },
    typeOfOrder: { type: String, enum: ["Buy", "Sell"], required: true },
    energy: { type: Number, required: true },
    chargePerUnit: { type: Number, required: true },
    state: { type: String, enum: ["posted", "accepted"], default: "posted" },
    acceptantVehicleId: { type: String, default: null },
    acceptedUserId: { type: String, default: null },
    acceptedTime: { type: Date, default: null },
    selectedContract: { type: String, enum: ["Manual", "Automatic"], required: true },
    location: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    createdAt: { type: Date, default: Date.now },
});

tradeSchema.index({ location: "2dsphere" });

const Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;
