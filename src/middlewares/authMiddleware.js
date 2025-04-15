import passport from "../config/passport.js";
import pool from "../config/db.js";

export const authenticateJWT = passport.authenticate("jwt", { session: false });

/**
 * Middleware para validar el rol del usuario autenticado.
 * @param {...string} roles - Roles permitidos
 */
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res
        .status(403)
        .json({ message: "Acceso denegado: rol insuficiente" });
    }
    next();
  };
}

export function authorizeSelfOrRoles(...roles) {
  return (req, res, next) => {
    const userId = Number(req.params.id); // o req.body.id según el endpoint
    if (
      (req.user && req.user.id === userId) ||
      (req.user && roles.includes(req.user.rol))
    ) {
      return next();
    }
    return res.status(403).json({ message: "Acceso denegado" });
  };
}

/**
 * Middleware para permitir solo al dueño del cliente o admin.
 */
export function authorizeClienteOwnerOrRoles(...roles) {
  return async (req, res, next) => {
    const clienteId = Number(req.params.id);
    // Busca el usuario dueño del cliente
    const [rows] = await pool.query(
      "SELECT usuarioId FROM Cliente WHERE id = ?",
      [clienteId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    const ownerId = rows[0].usuario_id;
    if (req.user.id === ownerId || roles.includes(req.user.rol)) {
      return next();
    }
    return res.status(403).json({ message: "Acceso denegado" });
  };
}

/* ej uso:
router.put(
  "/:id",
  authenticateJWT, // Primero autentica el JWT
  authorizeClienteOwnerOrRoles("admin"), // Luego autoriza según dueño o admin
  clienteController.update
);
*/
