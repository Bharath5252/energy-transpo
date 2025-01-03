const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        typeOfTransaction: { type: Number, required: true }, // 1 or 2
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        senderVehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
        receiverVehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
        committedEnergy: { type: Number, required: true },
        transferredEnergy: { type: Number, default: 0 },
        transactionStatus: { type: String, enum: ["Completed", "Incomplete", "InProgress", "Failed"], default: "InProgress" },
        chargePerUnit: { type: Number, required: true },
        credits: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;