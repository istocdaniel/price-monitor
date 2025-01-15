# Alap image a Node.js számára
FROM node:18-alpine

# Munka könyvtár beállítása
WORKDIR /usr/src/app

# Függőségek másolása
COPY package*.json ./

# Függőségek telepítése
RUN npm install

# Forráskód másolása
COPY . .

# Készíts egy build-et (ez akkor hasznos, ha TypeScript-et használsz)
RUN npm run build

# A port beállítása, amelyen a szerver futni fog
EXPOSE 3000

# Az alkalmazás indítása
CMD ["npm", "run", "start:dev"]
