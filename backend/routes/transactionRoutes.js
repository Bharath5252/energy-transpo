const express = require("express");
const router = express.Router();
const { initiateTransaction, preCheckTransaction, updateTransactionStats, getTransactionHistoryByUser, getAllTransactions } = require("../controllers/transactionController");

router.post("/initiate", initiateTransaction);
router.post("/pre-check", preCheckTransaction);
router.put("/update", updateTransactionStats);
router.get("/history", getTransactionHistoryByUser);
router.get("/", getAllTransactions);

module.exports = router;
