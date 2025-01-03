const Trade = require("../models/trade");

exports.createTrade = async (req, res) => {
    try {
        const trade = new Trade(req.body);
        const savedTrade = await trade.save();
        res.status(200).json({ message: "Trade posted successfully.", trade: savedTrade });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllTrades = async (req, res) => {
    try {
        const trades = await Trade.find({ state: "posted" }).populate("vehicleId");
        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cancelTrade = async (req, res) => {
    try {
        const { tradeId } = req.query;

        const deletedPost = await Trade.findByIdAndDelete(tradeId);

        if (!deletedPost) {
            return res.status(404).json({ message: "Trade post not found" });
        }

        res.status(200).json({ message: "Trade post cancelled successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cancelAcceptedTrade = async (req, res) => {
    try {
        const { tradeId } = req.query;

        const tradePost = await Trade.findById(tradeId);

        if (!tradePost) {
            return res.status(404).json({ message: "Trade post not found" });
        }

        if (tradePost.state !== "accepted") {
            return res.status(400).json({ message: "Trade post is not in 'accepted' state" });
        }

        tradePost.state = "posted";
        tradePost.acceptantVehicleId = null;

        await tradePost.save();

        res.status(200).json({ message: "Trade post cancelled and reverted to 'posted' state" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.acceptTrade = async (req, res) => {
    try {
        const { tradeId } = req.query;
        const { acceptantVehicleId, acceptedUserId } = req.body;

        const trade = await Trade.findById(tradeId);

        if (!trade || trade.state !== "posted") {
            return res.status(400).json({ message: "Invalid or already accepted trade." });
        }

        trade.state = "accepted";
        trade.acceptantVehicleId = acceptantVehicleId;
        trade.acceptedUserId = acceptedUserId;
        trade.acceptedTime = new Date();

        const updatedTrade = await trade.save();

        res.status(200).json({ message: "Trade accepted successfully.", updatedTrade: updatedTrade });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAcceptedTrades = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const trades = await Trade.find({
            state: "accepted",
            $or: [{ userId }, { acceptedUserId: userId }],
        });

        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getTradesByUser = async (req, res) => {
    try {
        const { userId } = req.query;
        const trades = await Trade.find({ userId });
        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getTradesNearby = async (req, res) => {
    try {
        const { latitude, longitude, maxDistance } = req.query;

        const trades = await Trade.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                    distanceField: "distance",
                    maxDistance: parseFloat(maxDistance) || 5000,
                    spherical: true,
                },
            },
            { $match: { state: "posted" } },
        ]);

        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};
