/**
 * Middleware para manejo de errores global.
 */
export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
  next(err);
}
