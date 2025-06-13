/**
 * Middleware para manejo de errores global.
 */

/**
 * Middleware para manejo de errores global.
 */
export function errorHandler(err, req, res, next) {
  console.error(err); // Log completo del error
  res.status(500).json({ message: "Error interno del servidor" });
}

