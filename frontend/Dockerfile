# Alap image, amely Node.js-t és npm-et tartalmaz
FROM node:18-alpine AS build

# Munkakönyvtár beállítása
WORKDIR /usr/src/app

# Csak a package.json és package-lock.json fájlokat másoljuk először
# Ez segít abban, hogy a Docker cache-elhesse a függőségek telepítését, ha nem változnak
COPY package*.json ./

# Függőségek telepítése
RUN npm install

# Az Angular alkalmazás forráskódjának másolása
COPY . .

# Az alkalmazás buildelése
RUN npm run build --prod

# A második lépésben használt image
# Ez az image csak az épített fájlokat tartalmazza és egy minimalista környezetet biztosít
FROM nginx:alpine

# Az épített Angular alkalmazás átmozgatása az NGINX webkiszolgálóba
COPY --from=build /usr/src/app/dist/price-monitor /usr/share/nginx/html

# Az NGINX alapértelmezett portja 80
EXPOSE 80

# Az NGINX futtatása
CMD ["nginx", "-g", "daemon off;"]
