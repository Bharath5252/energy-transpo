const express = require("express");
const router = express.Router();
const { getUser,  getVehicles } = require("../controllers/userController")
const { addVehicle, deleteVehicle } = require("../controllers/vehicleController");

router.get("/:userId", getUser);
router.get("/:userId/vehicles", getVehicles);

module.exports = router;