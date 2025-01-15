# Price Monitor Web Application

A webalkalmazás, amely lehetővé teszi az árak figyelését és értesítések küldését a felhasználóknak, ha a kívánt termékek ára csökken. Az alkalmazás a következő technológiákat használja:

- **Frontend**: Angular
- **Backend**: NestJS
- **Adatbázis**: PostgreSQL
- **Docker**: A fejlesztési környezet konténerizálása
- **Authentication**: JWT alapú felhasználói regisztráció és bejelentkezés

## Technológiai Stack

- **Backend**: 
  - NestJS
  - Passport.js
  - JWT
  - PostgreSQL

- **Frontend**: 
  - Angular
  - Bootstrap
  - Nginx (Docker container)

- **Adatbázis**: PostgreSQL

- **Konténerizálás**:
  - Docker
  - Docker Compose

## Fejlesztési Környezet Telepítése

### Előkészületek

1. Telepítsd a [Docker](https://www.docker.com/get-started) és [Docker Compose](https://docs.docker.com/compose/install/) legfrissebb verzióját.
2. Telepítsd az [Angular CLI-t](https://angular.io/cli) és a [Node.js](https://nodejs.org/) legfrissebb LTS verzióját.

### Projekt klónozása

Először is klónozd a repót a gépedre:

```bash
git clone https://github.com/your-username/price-monitor.git
cd price-monitor
