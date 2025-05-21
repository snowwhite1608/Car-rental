const { v4: uuidv4 } = require("uuid");

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
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
    brand: "Toyota",
    model: "Celica",
    year: 2001,
    status: "rented",
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
    brand: "Fiat",
    model: "Panda",
    year: 2006,
    status: "available",
  },
];
let rentals = require("./rentalController").rentals;

exports.getAllCars = (req, res) => {
  res.status(200).json(cars);
};

exports.getCarById = (req, res) => {
  const car = cars.find((c) => c.id === req.params.carId);
  if (car) {
    res.status(200).json(car);
  } else {
    res.status(404).json({ message: "Car not found" });
  }
};

exports.createCar = (req, res) => {
  const { brand, model, year, status } = req.body;
  if (!brand || !model || !year || !status) {
    return res.status(400).json({
      message: "All required fields are missing",
    });
  }
  if (!["available", "rented", "maintenance"].includes(status)) {
    return res.status(400).json({
      message:
        "Wrong status, available options: available, rented, maintenance",
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

exports.updateCar = (req, res) => {
  const carIndex = cars.findIndex((c) => c.id === req.params.carId);
  if (carIndex !== -1) {
    const { brand, model, year, status } = req.body;
    if (!brand && !model && !year && !status) {
      return res.status(400).json({ message: "No data to update" });
    }
    if (status && !["available", "rented", "maintenance"].includes(status)) {
      return res.status(400).json({
        message:
          "Wrong status, available options: available, rented, maintenance",
      });
    }

    const updatedCar = { ...cars[carIndex], ...req.body };
    cars[carIndex] = updatedCar;
    res.status(200).json(updatedCar);
  } else {
    res.status(404).json({ message: "Car not found" });
  }
};

exports.deleteCar = (req, res) => {
  const carId = req.params.carId;

  const isRented = rentals.some(
    (rental) => rental.carId === carId && rental.status === "active"
  );
  if (isRented) {
    return res.status(400).json({
      message: "Car is currently rented",
    });
  }

  const carIndex = cars.findIndex((c) => c.id === carId);
  if (carIndex !== -1) {
    cars.splice(carIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Car not found" });
  }
};

exports.cars = cars;
