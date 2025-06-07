import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import pedidoCandidatosRoutes from "./pedidoCandidatosRoutes.js";
import * as pedidoCandidatosService from "../services/pedidoCandidatosService.js";

vi.mock("../services/pedidoCandidatosService.js");

const app = express();
app.use(express.json());
app.use("/pedido-candidatos", pedidoCandidatosRoutes);

describe("pedidoCandidatosRoutes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /pedido-candidatos debe devolver todos", async () => {
    vi.mocked(pedidoCandidatosService.getAllPedidoCandidatos).mockResolvedValue(
      [{ id: 1, pedidoId: 1, tecnicoId: 1 }]
    );
    const res = await request(app).get("/pedido-candidatos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, pedidoId: 1, tecnicoId: 1 }]);
  });

  it("GET /pedido-candidatos/:id debe devolver uno", async () => {
    vi.mocked(
      pedidoCandidatosService.getPedidoCandidatosById
    ).mockResolvedValue({ id: 1, pedidoId: 1, tecnicoId: 1 });
    const res = await request(app).get("/pedido-candidatos/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, pedidoId: 1, tecnicoId: 1 });
  });

  it("POST /pedido-candidatos debe crear uno", async () => {
    vi.mocked(pedidoCandidatosService.createPedidoCandidatos).mockResolvedValue(
      { id: 2, pedidoId: 2, tecnicoId: 2 }
    );
    const res = await request(app)
      .post("/pedido-candidatos")
      .send({ pedidoId: 2, tecnicoId: 2 });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 2, pedidoId: 2, tecnicoId: 2 });
  });

  it("PUT /pedido-candidatos/:id debe actualizar uno", async () => {
    vi.mocked(pedidoCandidatosService.updatePedidoCandidatos).mockResolvedValue(
      { affectedRows: 1 }
    );
    const res = await request(app)
      .put("/pedido-candidatos/1")
      .send({ pedidoId: 1, tecnicoId: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "PedidoCandidatos actualizado" });
  });

  it("DELETE /pedido-candidatos/:id debe eliminar uno", async () => {
    vi.mocked(pedidoCandidatosService.deletePedidoCandidatos).mockResolvedValue(
      { affectedRows: 1 }
    );
    const res = await request(app).delete("/pedido-candidatos/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "PedidoCandidatos eliminado" });
  });
});
