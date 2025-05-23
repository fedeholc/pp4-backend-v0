import { describe, expect, it } from "vitest";
import {
  getAllFacturas,
  getFacturaById,
  createFactura,
  updateFactura,
  deleteFactura,
} from "../services/facturaService.js";
import { FacturaSchema } from "../types/schemas.js";

describe("getAllFacturas", () => {
  it("debe retornar un array de facturas válidas", async () => {
    const facturas = await getAllFacturas();
    expect(Array.isArray(facturas)).toBe(true);
    for (const factura of facturas) {
      const parsed = FacturaSchema.safeParse(factura);
      expect(parsed.success).toBe(true);
    }
  });
});

describe("createFactura y deleteFactura", () => {
  it("debe crear y luego eliminar una factura", async () => {
    /**@type {import("../types/index.js").Factura} */
    const facturaPrueba = {
      id: undefined,
      usuarioId: 1, // Usa un usuarioId válido existente en tu base
      fecha: new Date(),
      descripcion: "Factura de prueba",
      total: 100.5,
      metodoPago: "tarjeta",
    };
    const creada = await createFactura(facturaPrueba);
    expect(creada.id).toBeTruthy();
    expect(creada.descripcion).toBe(facturaPrueba.descripcion);
    // Eliminar
    const borrado = await deleteFactura(creada.id);
    expect(borrado.affectedRows === 1).toBe(true);
  });
});


describe("getFacturaById", () => {
  it("debe retornar una factura válida si existe", async () => {
    // Crea una factura para probar
    /**@type {import("../types/index.js").Factura} */
    const facturaPrueba = {
      id: undefined,
      usuarioId: 1,
      fecha: new Date(),
      descripcion: "Factura de prueba",
      total: 100.5,
      metodoPago: "tarjeta",
    };
    const creada = await createFactura(facturaPrueba);
    const factura = await getFacturaById(creada.id);
    expect(factura).toBeTruthy();
    const parsed = FacturaSchema.safeParse(factura);
    expect(parsed.success).toBe(true);
    // Limpiar
    await deleteFactura(creada.id);
  });

  it("debe retornar null si la factura no existe", async () => {
    const factura = await getFacturaById(999999);
    expect(factura).toBeNull();
  });
});

describe("updateFactura", () => {
  it("debe actualizar una factura existente", async () => {
    // Crear factura de prueba
    /**@type {import("../types/index.js").Factura} */
    const facturaPrueba = {
      id: undefined,
      usuarioId: 1,
      fecha: new Date(),
      descripcion: "Factura original",
      total: 100.5,
      metodoPago: "tarjeta",
    };
    const creada = await createFactura(facturaPrueba);
    // Actualizar
    /**@type {import("../types/index.js").Factura} */
    const nuevosDatos = {
      usuarioId: 1,
      fecha: new Date(),
      descripcion: "Factura actualizada",
      total: 200.0,
      metodoPago: "tarjeta",
    };
    const actualizado = await updateFactura(creada.id, nuevosDatos);
    expect(actualizado.affectedRows).toBe(1);
    // Verificar actualización
    const facturaActualizada = await getFacturaById(creada.id);
    expect(facturaActualizada.descripcion).toBe(nuevosDatos.descripcion);
    expect(facturaActualizada.total).toBe(nuevosDatos.total);
    // Limpiar
    await deleteFactura(creada.id);
  });
});
