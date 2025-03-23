@echo off
echo Creando estructura de directorios...
mkdir src
mkdir src\models
mkdir src\routes
mkdir public
mkdir public\js
mkdir public\css

echo Creando archivos base...
echo const express = require('express'); > src\server.js
echo const mongoose = require('mongoose'); >> src\server.js

echo const mongoose = require('mongoose'); > src\models\Task.js
echo const taskSchema = new mongoose.Schema({ >> src\models\Task.js

echo const express = require('express'); > src\routes\tasks.js
echo const router = express.Router(); >> src\routes\tasks.js

echo PORT=5000 > .env
echo MONGODB_URI=tu_url_mongodb >> .env

echo Instalando dependencias...
npm init -y
npm install express mongoose cors dotenv
npm install nodemon --save-dev

echo Configurando package.json...
echo {                                                    > package.json
echo   "name": "mi-api",                                 >> package.json
echo   "version": "1.0.0",                              >> package.json
echo   "main": "src/server.js",                         >> package.json
echo   "scripts": {                                      >> package.json
echo     "start": "node src/server.js",                 >> package.json
echo     "dev": "nodemon src/server.js"                 >> package.json
echo   },                                               >> package.json
echo   "dependencies": {}                               >> package.json
echo }                                                  >> package.json

echo ¡Listo! Estructura creada correctamente.
