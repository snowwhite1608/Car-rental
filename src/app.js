const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

dotenv.config();

const carRoutes = require("./routes/carRoutes");
const clientRoutes = require("./routes/clientRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

const app = express();

// Middleware
app.use(express.json()); // Do parsowania JSON w body requestu

// Prosty logger żądań
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Trasy API
app.use("/api/v1/cars", carRoutes);
app.use("/api/v1/clients", clientRoutes);
app.use("/api/v1/rentals", rentalRoutes);

// Swagger UI - Dokumentacja API
// Plik openapi.yaml powinien znajdować się w katalogu 'public' w głównym folderze projektu
try {
  const swaggerDocument = YAML.load(
    path.join(__dirname, "../public/openapi.yaml")
  );
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("Swagger UI dostępne pod /docs");
} catch (e) {
  console.error(
    "Nie udało się załadować pliku openapi.yaml dla Swagger UI:",
    e.message
  );
  app.get("/docs", (req, res) => {
    res
      .status(500)
      .send("Błąd ładowania dokumentacji API. Sprawdź konsolę serwera.");
  });
}

// Obsługa błędów 404 (Not Found) - gdy żaden inny middleware nie obsłużył żądania
app.use((req, res, next) => {
  res.status(404).json({ message: "Nie znaleziono zasobu" });
});

// Globalny error handler (musi mieć 4 argumenty)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Wystąpił wewnętrzny błąd serwera", error: err.message });
});

module.exports = app;
