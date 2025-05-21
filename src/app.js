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

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/v1/cars", carRoutes);
app.use("/api/v1/clients", clientRoutes);
app.use("/api/v1/rentals", rentalRoutes);

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
app.use((req, res, next) => {
  res.status(404).json({ message: "Nie znaleziono zasobu" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Wystąpił wewnętrzny błąd serwera", error: err.message });
});

module.exports = app;
