import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import areasRoutes from "./areasRoutes.js";
import * as areasService from "../services/areasService.js";

// Mockear passport.authenticate para que pase siempre en tests
vi.mock("../config/passport.js", () => ({
  default: {
    authenticate: () => (req, res, next) => next(),
  },
}));

vi.mock("../services/areasService.js");

const app = express();
app.use(express.json());
app.use("/areas", areasRoutes);

describe("areasRoutes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /areas debe devolver todas las áreas", async () => {
    vi.mocked(areasService.getAllAreas).mockResolvedValue([
      { id: 1, nombre: "Area 1" },
    ]);
    const res = await request(app).get("/areas");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, nombre: "Area 1" }]);
  });

  it("GET /areas/:id debe devolver un área", async () => {
    vi.mocked(areasService.getAreaById).mockResolvedValue({
      id: 1,
      nombre: "Area 1",
    });
    const res = await request(app).get("/areas/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, nombre: "Area 1" });
  });

  it("GET /areas/:id debe devolver 404 si no existe", async () => {
    vi.mocked(areasService.getAreaById).mockResolvedValue(null);
    const res = await request(app).get("/areas/99");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Área no encontrada" });
  });

  it("POST /areas debe crear un área", async () => {
    vi.mocked(areasService.createArea).mockResolvedValue({
      id: 2,
      nombre: "Nueva Área",
    });
    const res = await request(app)
      .post("/areas")
      .send({ nombre: "Nueva Área" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 2, nombre: "Nueva Área" });
  });

  it("PUT /areas/:id debe actualizar un área", async () => {
    vi.mocked(areasService.updateArea).mockResolvedValue();
    const res = await request(app).put("/areas/1").send({ nombre: "Editada" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Área actualizada" });
  });

  it("DELETE /areas/:id debe eliminar un área", async () => {
    vi.mocked(areasService.deleteArea).mockResolvedValue({ affectedRows: 1 });
    const res = await request(app).delete("/areas/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Área eliminada" });
  });
});
