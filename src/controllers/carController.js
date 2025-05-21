const { v4: uuidv4 } = require("uuid");

// Przechowywanie danych w pamięci (zamiast bazy danych dla uproszczenia)
let cars = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    brand: "Toyota",
    model: "Corolla",
    year: 2021,
    status: "available",
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
    brand: "Ford",
    model: "Focus",
    year: 2023,
    status: "rented",
  },
];
let rentals = require("./rentalController").rentals; // Dostęp do wypożyczeń

// Pobierz listę samochodów
exports.getAllCars = (req, res) => {
  res.status(200).json(cars);
};

// Pobierz dane konkretnego samochodu
exports.getCarById = (req, res) => {
  const car = cars.find((c) => c.id === req.params.carId);
  if (car) {
    res.status(200).json(car);
  } else {
    res.status(404).json({ message: "Samochód nie znaleziony" });
  }
};

// Dodaj nowy samochód
exports.createCar = (req, res) => {
  const { brand, model, year, status } = req.body;
  if (!brand || !model || !year || !status) {
    return res
      .status(400)
      .json({
        message: "Brak wszystkich wymaganych pól: brand, model, year, status",
      });
  }
  if (!["available", "rented", "maintenance"].includes(status)) {
    return res
      .status(400)
      .json({
        message:
          "Nieprawidłowy status. Dozwolone wartości: available, rented, maintenance",
      });
  }

  const newCar = {
    id: uuidv4(),
    brand,
    model,
    year,
    status,
  };
  cars.push(newCar);
  res.status(201).json(newCar);
};

// Zaktualizuj dane samochodu
exports.updateCar = (req, res) => {
  const carIndex = cars.findIndex((c) => c.id === req.params.carId);
  if (carIndex !== -1) {
    const { brand, model, year, status } = req.body;
    if (!brand && !model && !year && !status) {
      return res.status(400).json({ message: "Brak danych do aktualizacji" });
    }
    if (status && !["available", "rented", "maintenance"].includes(status)) {
      return res
        .status(400)
        .json({
          message:
            "Nieprawidłowy status. Dozwolone wartości: available, rented, maintenance",
        });
    }

    const updatedCar = { ...cars[carIndex], ...req.body };
    cars[carIndex] = updatedCar;
    res.status(200).json(updatedCar);
  } else {
    res.status(404).json({ message: "Samochód nie znaleziony" });
  }
};

// Usuń samochód
exports.deleteCar = (req, res) => {
  const carId = req.params.carId;
  // Sprawdź, czy samochód nie jest aktualnie wypożyczony
  const isRented = rentals.some(
    (rental) => rental.carId === carId && rental.status === "active"
  );
  if (isRented) {
    return res
      .status(400)
      .json({
        message:
          "Samochód jest aktualnie wypożyczony i nie może zostać usunięty",
      });
  }

  const carIndex = cars.findIndex((c) => c.id === carId);
  if (carIndex !== -1) {
    cars.splice(carIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Samochód nie znaleziony" });
  }
};

// Eksport dla innych modułów (np. rentalController)
exports.cars = cars;
