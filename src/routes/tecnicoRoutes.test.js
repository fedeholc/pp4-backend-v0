import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import tecnicoRoutes from "./tecnicoRoutes.js";
import * as tecnicoService from "../services/tecnicoService.js";

vi.mock("../services/tecnicoService.js");
vi.mock("../middlewares/authMiddleware.js", () => ({
  authenticateJWT: (req, res, next) => next(),
  authorizeRoles: () => (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/tecnicos", tecnicoRoutes);

describe("tecnicoRoutes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /tecnicos debe devolver todos", async () => {
    vi.mocked(tecnicoService.getAllTecnicos).mockResolvedValue([
      { id: 1, nombre: "Juan" },
    ]);
    const res = await request(app).get("/tecnicos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, nombre: "Juan" }]);
  });

  it("GET /tecnicos/:id debe devolver uno", async () => {
    vi.mocked(tecnicoService.getTecnicoById).mockResolvedValue({
      id: 1,
      nombre: "Juan",
    });
    const res = await request(app).get("/tecnicos/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, nombre: "Juan" });
  });

  it("POST /tecnicos debe crear uno", async () => {
    vi.mocked(tecnicoService.createTecnico).mockResolvedValue({
      id: 2,
      usuarioId: 10,
      nombre: "Ana",
      apellido: "García",
    });
    const res = await request(app)
      .post("/tecnicos")
      .send({ usuarioId: 10, nombre: "Ana", apellido: "García" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 2,
      usuarioId: 10,
      nombre: "Ana",
      apellido: "García",
    });
  });

  it("PUT /tecnicos/:id debe actualizar uno", async () => {
    vi.mocked(tecnicoService.updateTecnico).mockResolvedValue({
      affectedRows: 1,
    });
    const res = await request(app)
      .put("/tecnicos/1")
      .send({ nombre: "Editado" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Técnico actualizado" });
  });

  it("DELETE /tecnicos/:id debe eliminar uno", async () => {
    vi.mocked(tecnicoService.deleteTecnico).mockResolvedValue({
      affectedRows: 1,
    });
    const res = await request(app).delete("/tecnicos/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Técnico eliminado" });
  });
});
