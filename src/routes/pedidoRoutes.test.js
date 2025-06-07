import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import pedidoRoutes from "./pedidoRoutes.js";
import * as pedidoService from "../services/pedidoService.js";

vi.mock("../services/pedidoService.js");
vi.mock("../middlewares/authMiddleware.js", () => ({
  authenticateJWT: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/pedidos", pedidoRoutes);

describe("pedidoRoutes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /pedidos debe devolver todos", async () => {
    vi.mocked(pedidoService.getAllPedidos).mockResolvedValue([
      { id: 1, clienteId: 1, estado: "sin_candidatos" },
    ]);
    const res = await request(app).get("/pedidos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, clienteId: 1, estado: "sin_candidatos" },
    ]);
  });

  it("GET /pedidos/:id debe devolver uno", async () => {
    vi.mocked(pedidoService.getPedidoById).mockResolvedValue({
      id: 1,
      clienteId: 1,
      estado: "sin_candidatos",
    });
    const res = await request(app).get("/pedidos/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, clienteId: 1, estado: "sin_candidatos" });
  });

  it("POST /pedidos debe crear uno", async () => {
    vi.mocked(pedidoService.createPedido).mockResolvedValue({
      id: 2,
      clienteId: 2,
      areaId: 1,
      requerimiento: "Reparar PC",
      estado: "sin_candidatos",
    });
    const res = await request(app).post("/pedidos").send({
      clienteId: 2,
      areaId: 1,
      requerimiento: "Reparar PC",
      estado: "sin_candidatos",
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 2,
      clienteId: 2,
      areaId: 1,
      requerimiento: "Reparar PC",
      estado: "sin_candidatos",
    });
  });

  it("PUT /pedidos/:id debe actualizar uno", async () => {
    vi.mocked(pedidoService.updatePedido).mockResolvedValue({
      affectedRows: 1,
    });
    const res = await request(app)
      .put("/pedidos/1")
      .send({ clienteId: 1, estado: "con_candidatos" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Pedido actualizado" });
  });

  it("DELETE /pedidos/:id debe eliminar uno", async () => {
    vi.mocked(pedidoService.deletePedido).mockResolvedValue({
      affectedRows: 1,
    });
    const res = await request(app).delete("/pedidos/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Pedido eliminado" });
  });
});
