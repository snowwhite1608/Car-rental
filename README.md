# Car Rental API

Proste API do zarządzania wypożyczalnią samochodów, klientami i wypożyczeniami, zaimplementowane w Node.js przy użyciu frameworka Express.

## Wymagania

- Node.js (zalecana wersja LTS)
- npm (zazwyczaj instalowany z Node.js)

## Struktura Projektu

car-rental-api/
├── src/
│ ├── controllers/ # Logika biznesowa dla każdego zasobu
│ ├── routes/ # Definicje ścieżek API
│ ├── app.js # Główna konfiguracja aplikacji Express
│ └── server.js # Punkt startowy serwera HTTP
├── public/
│ └── openapi.yaml # Specyfikacja OpenAPI 3.0
├── .env # Zmienne środowiskowe (np. PORT)
├── .gitignore # Pliki ignorowane przez Git
├── package.json # Metadane projektu i zależności
└── README.md # Ten plik

## Instalacja

1.  Sklonuj repozytorium (lub skopiuj pliki do nowego katalogu `car-rental-api`).
2.  Przejdź do katalogu projektu:
    ```bash
    cd car-rental-api
    ```
3.  Zainstaluj zależności:
    ```bash
    npm install
    ```
4.  Utwórz plik `.env` w głównym katalogu projektu i dodaj do niego:
    ```
    PORT=8000
    ```

## Uruchomienie Projektu

### Tryb deweloperski (z `nodemon` - automatyczne przeładowanie po zmianach)

```bash
npm run dev
```
