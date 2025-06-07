import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import usuarioRoutes from "./usuarioRoutes.js";
import * as usuarioService from "../services/usuarioService.js";

vi.mock("../services/usuarioService.js");
vi.mock("../middlewares/authMiddleware.js", () => ({
  authenticateJWT: (req, res, next) => next(),
  authorizeRoles: () => (req, res, next) => next(),
  authorizeSelfOrRoles: () => (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/usuarios", usuarioRoutes);

describe("usuarioRoutes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /usuarios debe devolver todos los usuarios", async () => {
    vi.mocked(usuarioService.getAllUsuarios).mockResolvedValue([
      { id: 1, email: "test@mail.com" },
    ]);
    const res = await request(app).get("/usuarios");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, email: "test@mail.com" }]);
  });

  it("GET /usuarios/:id debe devolver un usuario", async () => {
    vi.mocked(usuarioService.getUsuarioById).mockResolvedValue({
      id: 1,
      email: "test@mail.com",
    });
    const res = await request(app).get("/usuarios/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, email: "test@mail.com" });
  });

  it("GET /usuarios/:id debe devolver 404 si no existe", async () => {
    vi.mocked(usuarioService.getUsuarioById).mockResolvedValue(null);
    const res = await request(app).get("/usuarios/99");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Usuario no encontrado" });
  });

  it("POST /usuarios debe crear un usuario", async () => {
    vi.mocked(usuarioService.createUsuario).mockResolvedValue({
      id: 2,
      email: "nuevo@mail.com",
      rol: "cliente",
    });
    const res = await request(app)
      .post("/usuarios")
      .send({ email: "nuevo@mail.com", password: "pw12", rol: "cliente" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 2,
      email: "nuevo@mail.com",
      rol: "cliente",
    });
  });

  it("PUT /usuarios/:id debe actualizar un usuario", async () => {
    vi.mocked(usuarioService.updateUsuario).mockResolvedValue(undefined);
    const res = await request(app)
      .put("/usuarios/1")
      .send({ email: "editado@mail.com" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Usuario actualizado" });
  });

  it("DELETE /usuarios/:id debe eliminar un usuario", async () => {
    vi.mocked(usuarioService.deleteUsuario).mockResolvedValue({
      affectedRows: 1,
    });
    const res = await request(app).delete("/usuarios/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Usuario eliminado" });
  });
});
