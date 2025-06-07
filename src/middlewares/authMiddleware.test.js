import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authMiddleware from "./authMiddleware.js";

function getMockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.end = vi.fn(); // Necesario para passport
  return res;
}

describe("authorizeRoles", () => {
  let req, res, next;
  beforeEach(() => {
    req = { user: { rol: "admin" } };
    res = getMockRes();
    next = vi.fn();
  });

  it("permite acceso si el usuario tiene el rol requerido", () => {
    const middleware = authMiddleware.authorizeRoles("admin");
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("deniega acceso si el usuario no tiene el rol requerido", () => {
    req.user.rol = "cliente";
    const middleware = authMiddleware.authorizeRoles("admin");
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Acceso denegado: rol insuficiente",
    });
  });
});
