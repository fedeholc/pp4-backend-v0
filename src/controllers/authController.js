import * as authService from "../services/authService.js";

const allowedRoles = ["cliente", "tecnico", "admin"];

function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

/**
 * Registro de usuario
 */
export async function register(req, res, next) {
  try {
    const { email, password, rol } = req.body;
    if (!email || !password || !rol)
      return res.status(400).json({ message: "Faltan datos requeridos" });
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Email inválido" });
    if (typeof password !== "string" || password.length < 6)
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    if (!allowedRoles.includes(rol))
      return res.status(400).json({ message: "Rol inválido" });
    const user = await authService.register({ email, password, rol });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * Login de usuario
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Faltan datos requeridos" });
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Email inválido" });
    if (typeof password !== "string" || password.length < 6)
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
