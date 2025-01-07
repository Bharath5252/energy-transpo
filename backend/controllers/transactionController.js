const Transaction = require("../models/transaction");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");

exports.initiateTransaction = async (req, res) => {
    try {
        const {
            typeOfTransaction,
            senderId,
            receiverId,
            senderVehicle,
            receiverVehicle,
            committedEnergy,
            credits,
            chargePerUnit,
        } = req.body;

        const transaction = new Transaction({
            typeOfTransaction,
            senderId,
            receiverId,
            senderVehicle,
            receiverVehicle,
            committedEnergy,
            credits,
            chargePerUnit,
        });

        const savedTransaction = await transaction.save();
        res.status(200).json({
            message: "Transaction initiated.",
            transactionId: savedTransaction._id,
            transaction: savedTransaction,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.preCheckTransaction = async (req, res) => {
    try {
        const {
            senderId,
            receiverId,
            senderVehicle,
            receiverVehicle,
            committedEnergy,
            chargePerUnit,
        } = req.body;

        if (!senderId || !receiverId || !senderVehicle || !receiverVehicle || !committedEnergy || !chargePerUnit) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        
        const senderVehicleData = await Vehicle.findById(senderVehicle);
        const receiverVehicleData = await Vehicle.findById(receiverVehicle);

        if (!sender || !receiver || !senderVehicleData || !receiverVehicleData) {
            return res.status(404).json({ message: "User or vehicle not found." });
        }

        const requiredEnergy = parseFloat(committedEnergy);
        const requiredMoney = requiredEnergy * chargePerUnit;
        console.log("senderVehicleData.energyAvailable:", senderVehicleData.energyAvailable);
        console.log("receiver.balance:", receiver.balance);

        if (senderVehicleData.energyAvailable < requiredEnergy) {
            return res.status(400).json({
                message: "Sender does not have enough energy available.",
                available_energy: senderVehicleData.energyAvailable,
            });
        }

        if (receiver.balance < requiredMoney) {
            return res.status(400).json({
                message: "Receiver does not have enough wallet balance.",
                available_balance: receiver.balance,
                required_balance: requiredMoney,
            });
        }

        res.status(200).json({
            message: "Pre-check successful. Sender has enough energy, and receiver has enough money.",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateTransactionStats = async (req, res) => {
    try {
        const { transactionId } = req.query;
        const { transferredEnergy, transactionStatus, chargePerUnit } = req.body;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        const sender = await User.findById(transaction.senderId);
        const receiver = await User.findById(transaction.receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "Sender or receiver not found." });
        }

        if (transactionStatus === "Completed" || transactionStatus === "Incomplete") {
            const energyCost = parseFloat(transferredEnergy) * chargePerUnit;

            if (sender.balance < energyCost) {
                return res.status(400).json({ message: "Insufficient funds in sender's wallet." });
            }

            sender.balance -= energyCost;
            receiver.balance += energyCost;

            transaction.transferredEnergy = transferredEnergy;
            transaction.transactionStatus = transactionStatus || transaction.transactionStatus;

            await sender.save();
            await receiver.save();
        } else if (transactionStatus === "Failed") {
            transaction.transactionStatus = "Failed";
        }

        transaction.updatedAt = new Date();
        const updatedTransaction = await transaction.save();

        res.status(200).json({
            message: `Transaction updated with status: ${transactionStatus}.`,
            transaction: updatedTransaction,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTransactionHistoryByUser = async (req, res) => {
    try {
        const { userId } = req.query;

        const transactions = await Transaction.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
            transactionStatus: { $ne: "InProgress" },
        }).populate("senderId receiverId senderVehicle receiverVehicle");

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found for this user." });
        }

        res.status(200).json({
            message: "Transactions fetched successfully.",
            transactions: transactions,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


