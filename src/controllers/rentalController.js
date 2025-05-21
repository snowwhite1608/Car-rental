const { v4: uuidv4 } = require("uuid");

let rentals = [
  {
    id: "rental_id_1",
    clientId: "c790f1ee-6c54-4b01-90e6-d701748f0851",
    carId: "223e4567-e89b-12d3-a456-426614174001",
    startDate: "2024-05-20T10:00:00Z",
    endDate: null,
    status: "active",
  },
  {
    id: "rental_id_3",
    clientId: "d290f1ee-6c54-4b01-90e6-d701748f0852",
    carId: "123e4567-e89b-12d3-a456-426614174000",
    startDate: "2024-04-10T09:00:00Z",
    endDate: "2024-04-15T17:00:00Z",
    status: "completed",
  },
];

const getCars = () => require("./carController").cars;
const getClients = () => require("./clientController").clients;

exports.createRental = (req, res) => {
  const { clientId, carId, startDate } = req.body;
  const cars = getCars();
  const clients = getClients();

  if (!clientId || !carId || !startDate) {
    return res.status(400).json({
      message: "Brak wszystkich wymaganych pól: clientId, carId, startDate",
    });
  }

  const clientExists = clients.find((c) => c.id === clientId);
  if (!clientExists) {
    return res.status(404).json({ message: "Klient nie znaleziony" });
  }

  const car = cars.find((c) => c.id === carId);
  if (!car) {
    return res.status(404).json({ message: "Samochód nie znaleziony" });
  }

  if (car.status !== "available") {
    return res
      .status(400)
      .json({ message: "Samochód nie jest dostępny do wypożyczenia" });
  }

  const newRental = {
    id: uuidv4(),
    clientId,
    carId,
    startDate: new Date(startDate).toISOString(),
    endDate: null,
    status: "active",
  };

  rentals.push(newRental);
  const carIndex = cars.findIndex((c) => c.id === carId);
  if (carIndex !== -1) {
    cars[carIndex].status = "rented";
  }

  res.status(201).json(newRental);
};
exports.finishRental = (req, res) => {
  const rentalId = req.params.rentalId;
  const cars = getCars();
  const rentalIndex = rentals.findIndex((r) => r.id === rentalId);

  if (rentalIndex === -1) {
    return res.status(404).json({ message: "Wypożyczenie nie znalezione" });
  }

  const rental = rentals[rentalIndex];
  if (rental.status === "completed") {
    return res
      .status(400)
      .json({ message: "Wypożyczenie już zostało zakończone" });
  }

  rental.endDate = new Date().toISOString();
  rental.status = "completed";

  const carIndex = cars.findIndex((c) => c.id === rental.carId);
  if (carIndex !== -1) {
    cars[carIndex].status = "available";
  }

  res.status(200).json(rental);
};

exports.getClientRentalHistory = (req, res) => {
  const clientId = req.params.clientId;
  const clients = getClients();

  const clientExists = clients.find((c) => c.id === clientId);
  if (!clientExists) {
    return res.status(404).json({ message: "Klient nie znaleziony" });
  }

  const clientRentals = rentals.filter((r) => r.clientId === clientId);
  res.status(200).json(clientRentals);
};

exports.getCurrentRentals = (req, res) => {
  const currentRentals = rentals.filter((r) => r.status === "active");
  res.status(200).json(currentRentals);
};

exports.rentals = rentals;
