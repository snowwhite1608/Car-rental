const app = require("./app");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
  console.log(
    `Dokumentacja API dostępna pod adresem http://localhost:${PORT}/docs`
  );
  console.log(`API dostępne pod adresem http://localhost:${PORT}/api/v1`);
});
