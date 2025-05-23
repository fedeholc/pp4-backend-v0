import { describe, expect, it } from "vitest";
import { register, login } from "../services/authService.js";

describe("register", () => {
  it("debe registrar un usuario nuevo", async () => {
    const email = `testauth${Date.now()}@mail.com`;
    const password = "testpass";
    const rol = "cliente";
    const usuario = await register({ email, password, rol });
    expect(usuario).toBeTruthy();
    expect(usuario.email).toBe(email);
    expect(usuario.rol).toBe(rol);
    // No hay deleteUser en authService, así que solo prueba creación
  });

  it("debe lanzar error si el email ya existe", async () => {
    const email = `testauth${Date.now()}@mail.com`;
    const password = "testpass";
    const rol = "cliente";
    await register({ email, password, rol });
    await expect(register({ email, password, rol })).rejects.toThrow();
  });
});

describe("login", () => {
  it("debe autenticar un usuario válido y devolver un token", async () => {
    const email = `testauthlogin${Date.now()}@mail.com`;
    const password = "testpass";
    const rol = "cliente";
    await register({ email, password, rol });
    const result = await login({ email, password });
    expect(result.token).toBeTruthy();
    expect(result.user.email).toBe(email);
  });

  it("debe fallar con credenciales inválidas", async () => {
    const response = await login({
      email: "noexiste@mail.com",
      password: "wrong",
    });
    expect(response).toBeNull();
  });
});
