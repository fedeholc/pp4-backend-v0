import { describe, expect, it, vi, beforeEach } from "vitest";
import { UsuarioSchema } from "../types/schemas.js";

const mockUsuarios = [
  { id: 1, email: "user1@mail.com", rol: "cliente" },
  { id: 2, email: "user2@mail.com", rol: "tecnico" },
];

vi.mock("../config/db.js", () => ({
  default: { query: vi.fn() },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(async (pw) => "hashed" + pw),
    compare: vi.fn(async (pw, hash) => hash === "hashed" + pw),
  },
}));

let pool;
beforeEach(async () => {
  pool = (await import("../config/db.js")).default;
  pool.query["mockReset"]();
});

describe("getAllUsuarios (mock)", () => {
  it("debe retornar un array de usuarios válidos", async () => {
    pool.query["mockResolvedValueOnce"]([mockUsuarios]);
    const { getAllUsuarios } = await import("../services/usuarioService.js");
    const usuarios = await getAllUsuarios();
    expect(Array.isArray(usuarios)).toBe(true);
    for (const usuario of usuarios) {
      const parsed = UsuarioSchema.safeParse(usuario);
      expect(parsed.success).toBe(true);
    }
  });
});

describe("getUsuarioById (mock)", () => {
  it("debe retornar un usuario válido si existe", async () => {
    pool.query["mockResolvedValueOnce"]([[mockUsuarios[0]]]);
    const { getUsuarioById } = await import("../services/usuarioService.js");
    const usuario = await getUsuarioById(1);
    expect(usuario).toBeTruthy();
    const parsed = UsuarioSchema.safeParse(usuario);
    expect(parsed.success).toBe(true);
  });

  it("debe retornar null si el usuario no existe", async () => {
    pool.query["mockResolvedValueOnce"]([[]]);
    const { getUsuarioById } = await import("../services/usuarioService.js");
    const usuario = await getUsuarioById(999999);
    expect(usuario).toBeNull();
  });
});

describe("createUsuario y deleteUsuario (mock)", () => {
  it("debe crear y luego eliminar un usuario", async () => {
    const usuarioPrueba = {
      id: undefined,
      email: "nuevo@mail.com",
      password: "pw",
      rol: "cliente", // tipo correcto
    };
    pool.query["mockResolvedValueOnce"]([{ insertId: 123 }]); // createUsuario
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // deleteUsuario
    const { createUsuario, deleteUsuario } = await import(
      "../services/usuarioService.js"
    );
    // @ts-ignore
    const creada = await createUsuario(usuarioPrueba);
    expect(creada.id).toBeTruthy();
    expect(creada.email).toBe(usuarioPrueba.email);
    const borrado = await deleteUsuario(creada.id);
    expect(borrado.affectedRows).toBe(1);
  });
});

describe("updateUsuario (mock)", () => {
  it("debe actualizar un usuario existente", async () => {
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // updateUsuario
    const { updateUsuario } = await import("../services/usuarioService.js");
    const nuevosDatos = {
      email: "actualizado@mail.com",
      rol: "admin", // tipo correcto
    };
    // @ts-ignore
    const result = await updateUsuario(1, nuevosDatos);
    expect(result.affectedRows).toBe(1);
  });
});
