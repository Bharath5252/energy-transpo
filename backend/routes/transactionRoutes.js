const express = require("express");
const router = express.Router();
const { initiateTransaction, preCheckTransaction, updateTransactionStats, getTransactionHistoryByUser } = require("../controllers/transactionController");

router.post("/initiate", initiateTransaction);
router.post("/pre-check", preCheckTransaction);
router.put("/update", updateTransactionStats);
router.get("/history", getTransactionHistoryByUser);

module.exports = router;
