const express = require("express");
const router = express.Router();
const { createTicket, getTicketById, getAllTickets, updateTicket } = require("../controllers/ticketController");

router.post("/create", createTicket);
router.get("/:userId", getTicketById)
router.get("/", getAllTickets);
router.put("/:ticketId", updateTicket);

module.exports = router;