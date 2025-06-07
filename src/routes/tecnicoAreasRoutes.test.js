import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import tecnicoAreasRoutes from "./tecnicoAreasRoutes.js";
import * as tecnicoAreasService from "../services/tecnicoAreasService.js";

vi.mock("../services/tecnicoAreasService.js");
vi.mock("../middlewares/authMiddleware.js", () => ({
  authenticateJWT: (req, res, next) => next(),
  authorizeRoles: () => (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/tecnico-areas", tecnicoAreasRoutes);

describe("tecnicoAreasRoutes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /tecnico-areas debe devolver todos", async () => {
    vi.mocked(tecnicoAreasService.getAllTecnicoAreas).mockResolvedValue([
      { id: 1, tecnicoId: 1, areaId: 1 },
    ]);
    const res = await request(app).get("/tecnico-areas");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, tecnicoId: 1, areaId: 1 }]);
  });

  it("GET /tecnico-areas/:id debe devolver uno", async () => {
    vi.mocked(tecnicoAreasService.getTecnicoAreaById).mockResolvedValue({
      id: 1,
      tecnicoId: 1,
      areaId: 1,
    });
    const res = await request(app).get("/tecnico-areas/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, tecnicoId: 1, areaId: 1 });
  });

  it("POST /tecnico-areas debe crear uno", async () => {
    vi.mocked(tecnicoAreasService.createTecnicoArea).mockResolvedValue({
      id: 2,
      tecnicoId: 2,
      areaId: 2,
    });
    const res = await request(app)
      .post("/tecnico-areas")
      .send({ tecnicoId: 2, areaId: 2 });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 2, tecnicoId: 2, areaId: 2 });
  });

  it("PUT /tecnico-areas/:id debe actualizar uno", async () => {
    vi.mocked(tecnicoAreasService.updateTecnicoArea).mockResolvedValue({
      affectedRows: 1,
    });
    const res = await request(app)
      .put("/tecnico-areas/1")
      .send({ tecnicoId: 1, areaId: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Técnico-Area actualizado" });
  });

  it("DELETE /tecnico-areas/:id debe eliminar uno", async () => {
    vi.mocked(tecnicoAreasService.deleteTecnicoArea).mockResolvedValue({
      affectedRows: 1,
    });
    const res = await request(app).delete("/tecnico-areas/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Técnico-Area eliminado" });
  });
});
