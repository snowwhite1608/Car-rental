const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");

router.get("/", rentalController.getCurrentRentals);
router.post("/", rentalController.createRental);
router.put("/:rentalId/finish", rentalController.finishRental);
router.get(
  "/client/:clientId/history",
  rentalController.getClientRentalHistory
);

module.exports = router;
