const express = require("express");
const { cancelPost, createTrade, getAllTrades, acceptTrade, getTradesByUser, cancelAcceptedPost, getTradesNearby } = require("../controllers/tradeController");
const router = express.Router();

router.delete("/cancel", cancelPost);
router.post("/", createTrade);
router.get("/", getAllTrades);
router.put("/accept", acceptTrade);
router.get("/user", getTradesByUser);
router.put("/cancel-accepted", cancelAcceptedPost);
router.get("/nearby", getTradesNearby);

module.exports = router;
