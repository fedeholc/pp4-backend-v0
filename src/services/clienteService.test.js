import { describe, it, expect } from "vitest";
import {
  getClienteById,
  getAllClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../services/clienteService.js";
import { ClienteSchema } from "../types/schemas";
import { createUsuario, deleteUsuario } from "../services/usuarioService.js";

/** @typedef {import('../types/index.js').Usuario} Usuario */

describe("getClienteById", () => {
  it("debe retornar un cliente válido si existe", async () => {
    // Usa un ID que sepas que existe en tu base de datos
    const idExistente = 1;
    const cliente = await getClienteById(idExistente);

    expect(cliente).toBeTruthy();
    // Valida que cumple con el schema
    const parsed = ClienteSchema.safeParse(cliente);
    expect(parsed.success).toBe(true);
  });

  it("debe retornar null si el cliente no existe", async () => {
    const idInexistente = 999999;
    const cliente = await getClienteById(idInexistente);
    expect(cliente).toBeNull();
  });
});

describe("getAllClientes", () => {
  it("debe retornar un array de clientes válidos", async () => {
    const clientes = await getAllClientes();
    expect(Array.isArray(clientes)).toBe(true);
    for (const cliente of clientes) {
      const parsed = ClienteSchema.safeParse(cliente);
      expect(parsed.success).toBe(true);
    }
  });
});

describe("createCliente y deleteCliente", () => {
  it("debe crear y luego eliminar un cliente", async () => {
    // Crear usuario de prueba
    /** @type {Usuario} */
    const usuarioPrueba = {
      id: undefined,
      email: `testcliente${Date.now()}@mail.com`,
      password: "testpass",
      rol: "cliente",
    };
    const usuarioCreado = await createUsuario(usuarioPrueba);
    // Datos de prueba para cliente
    const clientePrueba = {
      id: undefined, // dejar que la base asigne el id
      usuarioId: usuarioCreado.id,
      nombre: "TestNombre",
      apellido: "TestApellido",
      telefono: "123456789",
      direccion: "TestDireccion",
    };
    // Crear
    const creado = await createCliente(clientePrueba);
    expect(creado.id).toBeTruthy();
    expect(creado.nombre).toBe(clientePrueba.nombre);
    // Eliminar
    const borrado = await deleteCliente(creado.id);
    expect(borrado.affectedRows).toBe(1);
    // Limpiar usuario
    await deleteUsuario(usuarioCreado.id);
  });
});

describe("updateCliente", () => {
  it("debe actualizar un cliente existente", async () => {
    // Crear usuario de prueba
    /** @type {Usuario} */
    const usuarioPrueba = {
      id: undefined,
      email: `testupdate${Date.now()}@mail.com`,
      password: "testpass",
      rol: "cliente",
    };
    const usuarioCreado = await createUsuario(usuarioPrueba);
    // Crear cliente de prueba
    const clientePrueba = {
      id: undefined,
      usuarioId: usuarioCreado.id,
      nombre: "NombreOriginal",
      apellido: "ApellidoOriginal",
      telefono: "111111111",
      direccion: "DireccionOriginal",
    };
    const creado = await createCliente(clientePrueba);
    // Actualizar
    const nuevosDatos = {
      nombre: "NombreActualizado",
      apellido: "ApellidoActualizado",
      telefono: "222222222",
      direccion: "DireccionActualizada",
    };
    const actualizado = await updateCliente(creado.id, nuevosDatos);
    expect(actualizado.affectedRows).toBe(1);
    // Verificar actualización
    const clienteActualizado = await getClienteById(creado.id);
    expect(clienteActualizado.nombre).toBe(nuevosDatos.nombre);
    expect(clienteActualizado.apellido).toBe(nuevosDatos.apellido);
    // Limpiar
    await deleteCliente(creado.id);
    await deleteUsuario(usuarioCreado.id);
  });
});
