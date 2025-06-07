import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import clienteRoutes from "./clienteRoutes.js";
import * as clienteService from "../services/clienteService.js";

vi.mock("../services/clienteService.js");
vi.mock("../middlewares/authMiddleware.js", () => ({
  authenticateJWT: (req, res, next) => next(),
  authorizeRoles: () => (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/clientes", clienteRoutes);

describe("clienteRoutes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /clientes debe devolver todos los clientes", async () => {
    vi.mocked(clienteService.getAllClientes).mockResolvedValue([
      { id: 1, nombre: "Juan" },
    ]);
    const res = await request(app).get("/clientes");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, nombre: "Juan" }]);
  });

  it("GET /clientes/:id debe devolver un cliente", async () => {
    vi.mocked(clienteService.getClienteById).mockResolvedValue({
      id: 1,
      nombre: "Juan",
    });
    const res = await request(app).get("/clientes/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, nombre: "Juan" });
  });

  it("GET /clientes/:id debe devolver 404 si no existe", async () => {
    vi.mocked(clienteService.getClienteById).mockResolvedValue(null);
    const res = await request(app).get("/clientes/99");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Cliente no encontrado" });
  });

  it("POST /clientes debe crear un cliente", async () => {
    vi.mocked(clienteService.createCliente).mockResolvedValue({
      id: 2,
      usuarioId: 1,
      nombre: "Juan",
      apellido: "Pérez",
    });
    const res = await request(app)
      .post("/clientes")
      .send({ usuarioId: 1, nombre: "Juan", apellido: "Pérez" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 2,
      usuarioId: 1,
      nombre: "Juan",
      apellido: "Pérez",
    });
  });

  it("POST /clientes debe devolver 400 si faltan datos requeridos", async () => {
    const res = await request(app).post("/clientes").send({ nombre: "Juan" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Faltan datos requeridos" });
  });

  it("PUT /clientes/:id debe actualizar un cliente", async () => {
    vi.mocked(clienteService.updateCliente).mockResolvedValue(undefined);
    const res = await request(app)
      .put("/clientes/1")
      .send({ nombre: "Editado" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Cliente actualizado" });
  });

  it("DELETE /clientes/:id debe eliminar un cliente", async () => {
    vi.mocked(clienteService.deleteCliente).mockResolvedValue({
      affectedRows: 1,
    });
    const res = await request(app).delete("/clientes/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Cliente eliminado" });
  });
});
