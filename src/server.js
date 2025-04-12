import express from "express";
import path from "path";
import http from "http";
import process from "process";
import logger from "morgan";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

const CONFIG = {
  port: process.env.PORT || 3114, // Puerto por defecto
  address: process.env.ADDRESS || "localhost", // Dirección por defecto
  dbName: process.env.DB_NAME || "pp4a", // Nombre de la base de datos
  dbUser: process.env.DB_USER || "root", // Usuario de la base de datos
  dbPassword: process.env.DB_PASSWORD || "1234", // Contraseña de la base de datos
  dbHost: process.env.DB_HOST || "localhost", // Host de la base de datos
  dbPort: process.env.DB_PORT || 3306, // Puerto de la base de datos
  dbDialect: process.env.DB_DIALECT || "mysql", // Dialecto de la base de datos
  dbLogsEnabled: process.env.DB_LOGS_ENABLED || false, // Habilitar logs de la base de datos
  sequelizeBenchmarkEnabled: process.env.SEQUELIZE_BENCHMARK_ENABLED || false, // Habilitar benchmark de Sequelize
};

const loggin = () => {
  return CONFIG.dbLogsEnabled ? console.log : false;
};

const db = new Sequelize(
  CONFIG.dbName,
  CONFIG.dbUser,
  CONFIG.dbPassword,
  {
    host: CONFIG.dbHost,
    dialect: CONFIG.dbDialect,
    port: CONFIG.dbPort,
    benchmark: CONFIG.sequelizeBenchmarkEnabled,
    logging: loggin(),
  }
);

console.log("Configuración de la base de datos:", db.config);

console.log("Starting server...");

// instancia de la aplicación Express
const app = express();

// middlewares
// para egistrar las solicitudes HTTP en la consola
app.use(logger("dev"));

// para parsear JSON en las solicitudes
app.use(express.json());

// para parsear cuerpos URL-encoded
app.use(express.urlencoded({ extended: true }));

// para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(path.resolve(), "public")));

// rutas
// app.use("/v1", routes); // Aquí se podrían agregar rutas adicionales

// Ruta raíz
app.use("/", function (req, res) {
  return res.send("¡Hola!");
});

app.set("port", CONFIG.port);

// Crea el servidor HTTP utilizando la app de Express
const server = http.createServer(app);

// Inicia el servidor
server.listen(CONFIG.port, CONFIG.address);
server.on("error", onError);
server.on("listening", onListening);

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// para manejar errores del servidor
function onError(error) {
  if (error.syscall !== "listen") {
    throw error; // Si el error no está relacionado con "listen", lo lanzamos
  }

  // errores específicos
  switch (error.code) {
    case "EACCES":
      // Error de permisos
      console.error(CONFIG.port + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      // Error de puerto en uso
      console.error(CONFIG.port + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

//se ejecuta cuando el servidor comienza a escuchar
function onListening() {
  const addr = server.address(); // Obtenemos la dirección del servidor
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
}
