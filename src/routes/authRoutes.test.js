import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import authRoutes from "./authRoutes.js";
import * as authService from "../services/authService.js";

vi.mock("../services/authService.js");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("authRoutes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("POST /auth/register debe registrar un usuario", async () => {
    vi.mocked(authService.register).mockResolvedValue({
      id: 1,
      email: "nuevo@mail.com",
      rol: "cliente",
    });
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "nuevo@mail.com", password: "pw12", rol: "cliente" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: 1,
      email: "nuevo@mail.com",
      rol: "cliente",
    });
    expect(res.body).toHaveProperty("token");
  });

  it("POST /auth/login debe loguear un usuario", async () => {
    vi.mocked(authService.login).mockResolvedValue({
      token: "mock.jwt.token",
      user: { id: 1, email: "nuevo@mail.com", rol: "cliente" },
    });
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "nuevo@mail.com", password: "pw12" });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      token: "mock.jwt.token",
      user: { id: 1, email: "nuevo@mail.com", rol: "cliente" },
    });
  });
});
