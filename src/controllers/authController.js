import * as authService from "../services/authService.js";
import * as clienteService from "../services/clienteService.js";
import * as tecnicoService from "../services/tecnicoService.js";
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
 * @returns {Promise<{token: string, user: import("../types/index.js").UsuarioCompleto}>}
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

    /** @type {{token: string, user: import("../types/index.js").UsuarioCompleto}} */
    let result = null;

    const loginResponse = await authService.login({ email, password });
    if (!loginResponse) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    result = { ...loginResponse };
    console.log("loginResponse", loginResponse);
    if (loginResponse.user.rol === "cliente") {
      let response = await clienteService.getClienteByUserId(
        loginResponse.user.id
      );
      console.log("response cliente", response);
      if (response) {
        result.user.cliente = response;
      }
    } else if (loginResponse.user.rol === "tecnico") {
      let response = await tecnicoService.getTecnicoByUserId(
        loginResponse.user.id
      );
      if (response) {
        result.user.tecnico = response;
      }
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}
