import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import pedidoDisponibilidadRoutes from "./pedidoDisponibilidadRoutes.js";
import * as pedidoDisponibilidadService from "../services/pedidoDisponibilidadService.js";

vi.mock("../services/pedidoDisponibilidadService.js");

const app = express();
app.use(express.json());
app.use("/pedido-disponibilidad", pedidoDisponibilidadRoutes);

describe("pedidoDisponibilidadRoutes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /pedido-disponibilidad debe devolver todos", async () => {
    vi.mocked(
      pedidoDisponibilidadService.getAllPedidoDisponibilidad
    ).mockResolvedValue([{ id: 1, pedidoId: 1, clienteId: 1 }]);
    const res = await request(app).get("/pedido-disponibilidad");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, pedidoId: 1, clienteId: 1 }]);
  });

  it("GET /pedido-disponibilidad/:id debe devolver uno", async () => {
    vi.mocked(
      pedidoDisponibilidadService.getPedidoDisponibilidadById
    ).mockResolvedValue({ id: 1, pedidoId: 1, clienteId: 1 });
    const res = await request(app).get("/pedido-disponibilidad/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, pedidoId: 1, clienteId: 1 });
  });

  it("POST /pedido-disponibilidad debe crear uno", async () => {
    vi.mocked(
      pedidoDisponibilidadService.createPedidoDisponibilidad
    ).mockResolvedValue({ id: 2, pedidoId: 2, clienteId: 2, dia: "lunes" });
    const res = await request(app)
      .post("/pedido-disponibilidad")
      .send({ pedidoId: 2, clienteId: 2, dia: "lunes" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 2,
      pedidoId: 2,
      clienteId: 2,
      dia: "lunes",
    });
  });

  it("PUT /pedido-disponibilidad/:id debe actualizar uno", async () => {
    vi.mocked(
      pedidoDisponibilidadService.updatePedidoDisponibilidad
    ).mockResolvedValue({ affectedRows: 1 });
    const res = await request(app)
      .put("/pedido-disponibilidad/1")
      .send({ pedidoId: 1, clienteId: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "PedidoDisponibilidad actualizado" });
  });

  it("DELETE /pedido-disponibilidad/:id debe eliminar uno", async () => {
    vi.mocked(
      pedidoDisponibilidadService.deletePedidoDisponibilidad
    ).mockResolvedValue({ affectedRows: 1 });
    const res = await request(app).delete("/pedido-disponibilidad/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "PedidoDisponibilidad eliminado" });
  });
});
