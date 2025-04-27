// @ts-check
// ts-nocheck
import dotenv from "dotenv";
import express from "express";
import http from "http";
import logger from "morgan";
import path from "path";
import process from "process";
import passport from "./config/passport.js";
import areasRoutes from "./routes/areasRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import facturaRoutes from "./routes/facturaRoutes.js";
import pedidoDisponibilidadRoutes from "./routes/pedidoDisponibilidadRoutes.js";
import pedidoCandidatosRoutes from "./routes/pedidoCandidatosRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
dotenv.config();

const CONFIG = {
  port: parseInt(process.env.PORT) || 3114, // Puerto por defecto
  address: process.env.ADDRESS || "localhost", // Dirección por defecto
};

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

// Inicializa passport
app.use(passport.initialize());

// Rutas de la API
app.use("/api/areas", areasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/facturas", facturaRoutes);
app.use("/api/pedido-disponibilidad", pedidoDisponibilidadRoutes);
app.use("/api/pedido-candidatos", pedidoCandidatosRoutes);

// Documentación OpenAPI
const swaggerDocument = YAML.load(
  path.join(path.resolve(), "src/docs/openapi.yaml")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ruta raíz
/**
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {void}
 */
app.get("/", (req, res) => {
  res.send("API IS UP AND RUNNING!");
});

// Middleware de manejo de errores global
app.use(errorHandler);

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
