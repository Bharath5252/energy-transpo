const express = require("express");
const router = express.Router();
const { createTicket, getTicketById, getAllTickets } = require("../controllers/ticketController");

router.post("/create", createTicket);
router.get("/:userId", getTicketById)
router.get("/", getAllTickets);

module.exports = router;