const express = require("express");
const router = express.Router();
const { getVehicles, addVehicle, deleteVehicle } = require("../controllers/vehicleController");

router.post("/add", addVehicle);
router.post("/delete", deleteVehicle);

module.exports = router;