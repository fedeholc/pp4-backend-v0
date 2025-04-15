// @ts-check
// ts-nocheck
import express from "express";
import path from "path";
import http from "http";
import process from "process";
import logger from "morgan";
import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
import mysql from "mysql2/promise";
dotenv.config();

const CONFIG = {
  port: parseInt(process.env.PORT) || 3114, // Puerto por defecto
  address: process.env.ADDRESS || "localhost", // Dirección por defecto
  dbName: process.env.DB_NAME || "pp4a", // Nombre de la base de datos
  dbUser: process.env.DB_USER || "root", // Usuario de la base de datos
  dbPassword: process.env.DB_PASSWORD || "1234", // Contraseña de la base de datos
  dbHost: process.env.DB_HOST || "localhost", // Host de la base de datos
  dbPort: parseInt(process.env.DB_PORT) || 3306, // Puerto de la base de datos

  dbDialect: /**@type {import('sequelize').Dialect} */ ("mysql"), // Dialecto de la base de datos
  dbLogsEnabled: process.env.DB_LOGS_ENABLED === "true", // Habilitar logs de la base de datos
  sequelizeBenchmarkEnabled:
    process.env.SEQUELIZE_BENCHMARK_ENABLED === "true" ? true : false, // Habilitar benchmark de Sequelize
};

const mysqlConnection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
});

await mysqlConnection.query("CREATE DATABASE IF NOT EXISTS pp4a;");
await mysqlConnection.end();

const loggin = () => {
  return CONFIG.dbLogsEnabled ? console.log : false;
};

const db = new Sequelize(CONFIG.dbName, CONFIG.dbUser, CONFIG.dbPassword, {
  host: CONFIG.dbHost,
  dialect: CONFIG.dbDialect,
  port: CONFIG.dbPort,
  benchmark: CONFIG.sequelizeBenchmarkEnabled,
  logging: loggin(),
});

console.log("Configuración de la base de datos:", db.config);

try {
  await db.authenticate();
  console.log(
    "Connection has been established successfully to: ",
    db.config.database
  );
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const User = db.define(
  "User",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
  },
  {
    tableName: "User",
    timestamps: true,
  }
);

const Client = db.define(
  "Client",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User", // This is the table name of the User model
        key: "id", // This is the primary key of the User model
      },
    },
  },
  {
    tableName: "Client",
    timestamps: true,
  }
);

Client.belongsTo(User, { foreignKey: "userId", as: "user" });

await db.sync({ force: true });
 
User.create({
  userName: "admin",
  password: "admin",
})
  .then(() => {
    console.log("User created successfully.");
  })
  .catch((error) => {
    console.error("Error creating user:", error);
  });
Client.create({
  firstName: "John",
  lastName: "Doe",
  userId: 1,
})
  .then(() => {
    console.log("Client created successfully.");
  })
  .catch((error) => {
    console.error("Error creating client:", error);
  }); 

// Sincroniza los modelos con la base de datos
/* await db.sync({ force: true }); */

console.log("All models were synchronized successfully.");

console.log("Models:", db.models);

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
/**
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {void}
 */
app.use("/", (req, res) => {
  res.send("API IS UP AND RUNNING!");
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
