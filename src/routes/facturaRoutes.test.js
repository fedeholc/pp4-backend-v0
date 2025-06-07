import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import facturaRoutes from "./facturaRoutes.js";
import * as facturaService from "../services/facturaService.js";

vi.mock("../services/facturaService.js");
vi.mock("../middlewares/authMiddleware.js", () => ({
  authenticateJWT: (req, res, next) => next(),
  authorizeRoles: () => (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/facturas", facturaRoutes);

describe("facturaRoutes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /facturas debe devolver todas las facturas", async () => {
    vi.mocked(facturaService.getAllFacturas).mockResolvedValue([
      { id: 1, descripcion: "Factura 1" },
    ]);
    const res = await request(app).get("/facturas");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, descripcion: "Factura 1" }]);
  });

  it("GET /facturas/:id debe devolver una factura", async () => {
    vi.mocked(facturaService.getFacturaById).mockResolvedValue({
      id: 1,
      descripcion: "Factura 1",
    });
    const res = await request(app).get("/facturas/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, descripcion: "Factura 1" });
  });

  it("GET /facturas/:id debe devolver 404 si no existe", async () => {
    vi.mocked(facturaService.getFacturaById).mockResolvedValue(null);
    const res = await request(app).get("/facturas/99");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Factura no encontrada" });
  });

  it("POST /facturas debe crear una factura", async () => {
    vi.mocked(facturaService.createFactura).mockResolvedValue({
      id: 2,
      usuarioId: 1,
      descripcion: "Nueva Factura",
      total: 100,
      metodoPago: "tarjeta",
    });
    const res = await request(app).post("/facturas").send({
      usuarioId: 1,
      descripcion: "Nueva Factura",
      total: 100,
      metodoPago: "tarjeta",
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 2,
      usuarioId: 1,
      descripcion: "Nueva Factura",
      total: 100,
      metodoPago: "tarjeta",
    });
  });

  it("PUT /facturas/:id debe actualizar una factura", async () => {
    vi.mocked(facturaService.updateFactura).mockResolvedValue(undefined);
    const res = await request(app)
      .put("/facturas/1")
      .send({ descripcion: "Editada" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Factura actualizada" });
  });

  it("DELETE /facturas/:id debe eliminar una factura", async () => {
    vi.mocked(facturaService.deleteFactura).mockResolvedValue({
      affectedRows: 1,
    });
    const res = await request(app).delete("/facturas/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Factura eliminada" });
  });
});
