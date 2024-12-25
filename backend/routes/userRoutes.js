const express = require("express");
const router = express.Router();
const { getUser,  getVehicles } = require("../controllers/userController")
const { addVehicle, deleteVehicle } = require("../controllers/vehicleController");

router.get("/", getUser);
router.get("/vehicles", getVehicles);

module.exports = router;