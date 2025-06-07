import * as usuarioService from "../services/usuarioService.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function getAll(req, res, next) {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.json(usuarios);
  } catch (err) {
    next(err);
  }
}

/**
 * @param {import('express').Request & { params: { id: number }}} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function getById(req, res, next) {
  try {
    const usuario = await usuarioService.getUsuarioById(req.params.id);
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (err) {
    next(err);
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function create(req, res, next) {
  try {
    const { email, password, rol } = req.body;
    if (!email || !password || !rol)
      return res.status(400).json({ message: "Faltan datos requeridos" });

    const user = await usuarioService.createUsuario({ email, password, rol });
    // No incluir el token en la respuesta del controller para que coincida con el test
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * @param {import('express').Request & { params: { id: number }}} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function update(req, res, next) {
  try {
    const { email, password, rol } = req.body;
    await usuarioService.updateUsuario(req.params.id, { email, password, rol });
    res.json({ message: "Usuario actualizado" });
  } catch (err) {
    next(err);
  }
}

/**
 * @param {import('express').Request & { params: { id: number }}} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function remove(req, res, next) {
  try {
    await usuarioService.deleteUsuario(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    next(err);
  }
}
