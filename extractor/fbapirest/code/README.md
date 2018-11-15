1.- Instalar:

Crear la imagen:

- docker-compose build fbapirestcd ..

Descargar dependencias de node:

- docker-compose run fbapirest npm install


2.- Levantar contenedor:

- docker-compose up fbapirest

o para dejar corriendo permanentemente de fondo

- docker-compose up -d fbapirest

Ejecutar aplicación node:

- docker exec -it fbapirest node server.js

Entrar al contenedor:

- docker exec -it fbapirest bash
