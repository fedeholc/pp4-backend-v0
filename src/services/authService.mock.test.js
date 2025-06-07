import { describe, expect, it, vi, beforeEach } from "vitest";

const mockUsuario = { id: 1, email: "test@mail.com", rol: "cliente" };
const mockToken = "mock.jwt.token";

vi.mock("../config/db.js", () => ({
  default: { query: vi.fn() },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(async (pw) => "hashed" + pw),
    compare: vi.fn(async (pw, hash) => hash === "hashed" + pw),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(() => "mock.jwt.token"),
    verify: vi.fn(() => ({ id: 1, email: "test@example.com", rol: "admin" })),
  },
  sign: vi.fn(() => "mock.jwt.token"),
  verify: vi.fn(() => ({ id: 1, email: "test@example.com", rol: "admin" })),
}));

let pool;
beforeEach(async () => {
  pool = (await import("../config/db.js")).default;
  pool.query["mockReset"]();
});

describe("register (mock)", () => {
  it("debe registrar un usuario nuevo", async () => {
    pool.query["mockResolvedValueOnce"]([[]]); // no existe
    pool.query["mockResolvedValueOnce"]([{ insertId: 1, affectedRows: 1 }]); // insert
    const { register } = await import("../services/authService.js");
    const usuario = await register({
      email: mockUsuario.email,
      password: "pw",
      rol: mockUsuario.rol,
    });
    expect(usuario.email).toBe(mockUsuario.email);
    expect(usuario.rol).toBe(mockUsuario.rol);
  });

  it("debe lanzar error si el email ya existe", async () => {
    pool.query["mockResolvedValueOnce"]([[{ id: 1 }]]); // existe
    const { register } = await import("../services/authService.js");
    await expect(
      register({
        email: mockUsuario.email,
        password: "pw",
        rol: mockUsuario.rol,
      })
    ).rejects.toThrow();
  });
});

describe("login (mock)", () => {
  it("debe autenticar un usuario válido y devolver un token", async () => {
    pool.query["mockResolvedValueOnce"]([
      [
        {
          id: 1,
          email: mockUsuario.email,
          password: "hashedpw",
          rol: mockUsuario.rol,
        },
      ],
    ]); // usuario encontrado
    const { login } = await import("../services/authService.js");
    const result = await login({ email: mockUsuario.email, password: "pw" });
    expect(result.token).toBe(mockToken);
    expect(result.user.email).toBe(mockUsuario.email);
  });

  it("debe fallar con credenciales inválidas", async () => {
    pool.query["mockResolvedValueOnce"]([[]]); // usuario no encontrado
    const { login } = await import("../services/authService.js");
    const result = await login({
      email: "noexiste@mail.com",
      password: "wrong",
    });
    expect(result).toBeNull();
  });
});
