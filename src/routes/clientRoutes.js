const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.get("/", clientController.getAllClients);
router.post("/", clientController.createClient);
router.get("/:clientId", clientController.getClientById); // Dodano endpoint
router.put("/:clientId", clientController.updateClient);
router.delete("/:clientId", clientController.deleteClient);

module.exports = router;
