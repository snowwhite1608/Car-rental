const { v4: uuidv4 } = require("uuid");

let clients = [
  {
    id: "c790f1ee-6c54-4b01-90e6-d701748f0851",
    firstName: "Anna",
    lastName: "Nowak",
    drivingLicenseNumber: "XYZ987654",
    contact: "anna.nowak@example.com",
  },
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0852",
    firstName: "Piotr",
    lastName: "Zieliński",
    drivingLicenseNumber: "DEF456123",
    contact: "piotr.zielinski@example.com",
  },
];
let rentals = require("./rentalController").rentals; // Dostęp do wypożyczeń

exports.getAllClients = (req, res) => {
  res.status(200).json(clients);
};

exports.getClientById = (req, res) => {
  const client = clients.find((c) => c.id === req.params.clientId);
  if (client) {
    res.status(200).json(client);
  } else {
    res.status(404).json({ message: "Klient nie znaleziony" });
  }
};

exports.createClient = (req, res) => {
  const { firstName, lastName, drivingLicenseNumber, contact } = req.body;
  if (!firstName || !lastName || !drivingLicenseNumber || !contact) {
    return res.status(400).json({
      message:
        "Brak wszystkich wymaganych pól: firstName, lastName, drivingLicenseNumber, contact",
    });
  }
  if (
    clients.some(
      (client) => client.drivingLicenseNumber === drivingLicenseNumber
    )
  ) {
    return res
      .status(400)
      .json({ message: "Klient z takim numerem prawa jazdy już istnieje." });
  }

  const newClient = {
    id: uuidv4(),
    firstName,
    lastName,
    drivingLicenseNumber,
    contact,
  };
  clients.push(newClient);
  res.status(201).json(newClient);
};

exports.updateClient = (req, res) => {
  const clientIndex = clients.findIndex((c) => c.id === req.params.clientId);
  if (clientIndex !== -1) {
    const { firstName, lastName, drivingLicenseNumber, contact } = req.body;
    if (!firstName && !lastName && !drivingLicenseNumber && !contact) {
      return res.status(400).json({ message: "Brak danych do aktualizacji" });
    }
    if (
      drivingLicenseNumber &&
      clients[clientIndex].drivingLicenseNumber !== drivingLicenseNumber &&
      clients.some(
        (client) =>
          client.id !== req.params.clientId &&
          client.drivingLicenseNumber === drivingLicenseNumber
      )
    ) {
      return res.status(400).json({
        message: "Inny klient z takim numerem prawa jazdy już istnieje.",
      });
    }

    const updatedClient = { ...clients[clientIndex], ...req.body };
    clients[clientIndex] = updatedClient;
    res.status(200).json(updatedClient);
  } else {
    res.status(404).json({ message: "Klient nie znaleziony" });
  }
};

exports.deleteClient = (req, res) => {
  const clientId = req.params.clientId;
  const hasActiveRentals = rentals.some(
    (rental) => rental.clientId === clientId && rental.status === "active"
  );
  if (hasActiveRentals) {
    return res.status(400).json({
      message: "Klient ma aktywne wypożyczenia i nie może zostać usunięty",
    });
  }

  const clientIndex = clients.findIndex((c) => c.id === clientId);
  if (clientIndex !== -1) {
    clients.splice(clientIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Klient nie znaleziony" });
  }
};

exports.clients = clients;
