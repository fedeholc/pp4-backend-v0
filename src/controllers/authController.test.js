import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authController from "./authController.js";
import * as authService from "../services/authService.js";

vi.mock("../services/authService.js");

function getMockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("authController", () => {
  let req, res, next;
  beforeEach(() => {
    res = getMockRes();
    next = vi.fn();
  });

  it("register responde con el usuario creado y token", async () => {
    req = {
      body: { email: "nuevo@mail.com", password: "pw12", rol: "cliente" },
    };
    vi.mocked(authService.register).mockResolvedValue({
      id: 1,
      email: "nuevo@mail.com",
      rol: "cliente",
    });
    await authController.register(req, res, next);
    expect(authService.register).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        email: "nuevo@mail.com",
        rol: "cliente",
        token: expect.any(String),
      })
    );
  });

  it("login responde con token y usuario", async () => {
    req = { body: { email: "nuevo@mail.com", password: "pw12" } };
    vi.mocked(authService.login).mockResolvedValue({
      token: "mock.jwt.token",
      user: { id: 1, email: "nuevo@mail.com", rol: "cliente" },
    });
    await authController.login(req, res, next);
    expect(authService.login).toHaveBeenCalledWith(req.body);
    expect(res.json).toHaveBeenCalledWith({
      token: "mock.jwt.token",
      user: { id: 1, email: "nuevo@mail.com", rol: "cliente" },
    });
  });

  it("register responde 400 y mensaje si el servicio falla", async () => {
    req = {
      body: { email: "fail@mail.com", password: "pw12", rol: "cliente" },
    };
    const error = new Error("fail");
    vi.mocked(authService.register).mockRejectedValue(error);
    await authController.register(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "fail" });
  });

  it("login pasa error a next si el servicio falla", async () => {
    req = { body: { email: "fail@mail.com", password: "pw12" } };
    const error = new Error("fail");
    vi.mocked(authService.login).mockRejectedValue(error);
    await authController.login(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
