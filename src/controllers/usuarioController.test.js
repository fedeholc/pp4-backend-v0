import { describe, it, expect, vi, beforeEach } from "vitest";
import * as usuarioService from "../services/usuarioService.js";
import * as usuarioController from "./usuarioController.js";

function mockRes() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };
}

describe("usuarioController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getAll", () => {
    it("debe devolver todos los usuarios", async () => {
      const mockUsuarios = [{ id: 1, email: "test@mail.com" }];
      vi.spyOn(usuarioService, "getAllUsuarios").mockResolvedValue(
        mockUsuarios
      );
      const req = {};
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await usuarioController.getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(mockUsuarios);
    });
  });

  describe("getById", () => {
    it("debe devolver el usuario si existe", async () => {
      const usuario = { id: 1, email: "test@mail.com" };
      vi.spyOn(usuarioService, "getUsuarioById").mockResolvedValue(usuario);
      const req = { params: { id: 1 } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await usuarioController.getById(req, res, next);
      expect(res.json).toHaveBeenCalledWith(usuario);
    });
    it("debe devolver 404 si no existe", async () => {
      vi.spyOn(usuarioService, "getUsuarioById").mockResolvedValue(null);
      const req = { params: { id: 99 } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await usuarioController.getById(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuario no encontrado",
      });
    });
  });

  describe("create", () => {
    it("debe crear un usuario y devolverlo", async () => {
      const usuario = {
        email: "nuevo@mail.com",
        password: "pw",
        rol: "cliente",
      };
      // @ts-ignore
      vi.spyOn(usuarioService, "createUsuario").mockResolvedValue(usuario);
      const req = { body: usuario };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await usuarioController.create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(usuario);
    });
  });

  describe("update", () => {
    it("debe actualizar el usuario y devolver mensaje", async () => {
      // @ts-ignore
      vi.spyOn(usuarioService, "updateUsuario").mockResolvedValue();
      const req = { params: { id: 1 }, body: { email: "editado@mail.com" } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await usuarioController.update(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: "Usuario actualizado" });
    });
  });

  describe("remove", () => {
    it("debe eliminar el usuario y devolver mensaje", async () => {
      vi.spyOn(usuarioService, "deleteUsuario").mockResolvedValue({
        affectedRows: 1,
      });
      const req = { params: { id: 1 } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await usuarioController.remove(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: "Usuario eliminado" });
    });
  });
});
