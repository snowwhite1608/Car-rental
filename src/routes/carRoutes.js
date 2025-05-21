const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

router.get("/", carController.getAllCars);
router.post("/", carController.createCar);
router.get("/:carId", carController.getCarById);
router.put("/:carId", carController.updateCar);
router.delete("/:carId", carController.deleteCar);

module.exports = router;
