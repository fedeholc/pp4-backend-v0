import { describe, expect, it, vi, beforeEach } from "vitest";
import { ClienteSchema } from "../types/schemas.js";

const mockClientes = [
  {
    id: 1,
    usuarioId: 1,
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "123456789",
    direccion: "Calle 1",
    fechaRegistro: new Date(),
  },
  {
    id: 2,
    usuarioId: 2,
    nombre: "Ana",
    apellido: "García",
    telefono: "987654321",
    direccion: "Calle 2",
    fechaRegistro: new Date(),
  },
];

vi.mock("../config/db.js", () => ({
  default: { query: vi.fn() },
}));

let pool;
beforeEach(async () => {
  pool = (await import("../config/db.js")).default;
  pool.query["mockReset"]();
});

describe("getAllClientes (mock)", () => {
  it("debe retornar un array de clientes válidos", async () => {
    pool.query["mockResolvedValueOnce"]([mockClientes]);
    const { getAllClientes } = await import("../services/clienteService.js");
    const clientes = await getAllClientes();
    expect(Array.isArray(clientes)).toBe(true);
    for (const cliente of clientes) {
      const parsed = ClienteSchema.safeParse(cliente);
      expect(parsed.success).toBe(true);
    }
  });
});

describe("getClienteById (mock)", () => {
  it("debe retornar un cliente válido si existe", async () => {
    pool.query["mockResolvedValueOnce"]([[mockClientes[0]]]);
    const { getClienteById } = await import("../services/clienteService.js");
    const cliente = await getClienteById(1);
    expect(cliente).toBeTruthy();
    const parsed = ClienteSchema.safeParse(cliente);
    expect(parsed.success).toBe(true);
  });

  it("debe retornar null si el cliente no existe", async () => {
    pool.query["mockResolvedValueOnce"]([[]]);
    const { getClienteById } = await import("../services/clienteService.js");
    const cliente = await getClienteById(999999);
    expect(cliente).toBeNull();
  });
});

describe("createCliente y deleteCliente (mock)", () => {
  it("debe crear y luego eliminar un cliente", async () => {
    const clientePrueba = {
      id: undefined,
      usuarioId: 3,
      nombre: "TestNombre",
      apellido: "TestApellido",
      telefono: "123456789",
      direccion: "TestDireccion",
      fechaRegistro: new Date(),
    };
    pool.query["mockResolvedValueOnce"]([{ insertId: 123 }]); // createCliente
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // deleteCliente
    const { createCliente, deleteCliente } = await import(
      "../services/clienteService.js"
    );
    const creada = await createCliente(clientePrueba);
    expect(creada.id).toBeTruthy();
    expect(creada.nombre).toBe(clientePrueba.nombre);
    const borrado = await deleteCliente(creada.id);
    expect(borrado.affectedRows).toBe(1);
  });
});

describe("updateCliente (mock)", () => {
  it("debe actualizar un cliente existente", async () => {
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // updateCliente
    const { updateCliente } = await import("../services/clienteService.js");
    const nuevosDatos = {
      nombre: "NombreActualizado",
      apellido: "ApellidoActualizado",
      telefono: "999999999",
      direccion: "NuevaDireccion",
    };
    const result = await updateCliente(1, nuevosDatos);
    expect(result.affectedRows).toBe(1);
  });
});
