const User = require("../models/user");
const Vehicle = require("../models/vehicle")
const axios = require("axios");

const getUser = async (req, res) => {
    const { userId } = req.query;

    try {
        
        const user = await User.findById(userId).populate('vehicles');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            user: {
                userId: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                organization: user.organization,
                balance: user.balance,
                vehicles: user.vehicles,
            },
        });
    } catch (error) {
        console.error("Error retrieving user data:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


const getVehicles = async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId).populate('vehicles');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "User vehicles retrieved successfully.",
            vehicles: user.vehicles
        });
    } catch (error) {
        console.error("Error retrieving vehicles:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { getUser, getVehicles };
