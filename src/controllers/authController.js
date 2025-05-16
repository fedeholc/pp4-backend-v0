import * as authService from "../services/authService.js";
import jwt from "jsonwebtoken";
import process from "node:process";
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
    if (typeof password !== "string" || password.length < 4)
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 4 caracteres" });
    if (!allowedRoles.includes(rol))
      return res.status(400).json({ message: "Rol inválido" });
    const user = await authService.register({ email, password, rol });
    // Generar token JWT

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({ ...user, token });
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
    if (typeof password !== "string" || password.length < 4)
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 4 caracteres" });
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
