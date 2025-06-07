import { describe, expect, it, vi, beforeEach } from "vitest";
import { FacturaSchema } from "../types/schemas.js";

const mockFacturas = [
  {
    id: 1,
    usuarioId: 1,
    fecha: new Date(),
    descripcion: "Factura 1",
    total: 100.5,
    metodoPago: "tarjeta",
  },
  {
    id: 2,
    usuarioId: 2,
    fecha: new Date(),
    descripcion: "Factura 2",
    total: 200,
    metodoPago: "transferencia",
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

describe("getAllFacturas (mock)", () => {
  it("debe retornar un array de facturas válidas", async () => {
    pool.query["mockResolvedValueOnce"]([mockFacturas]);
    const { getAllFacturas } = await import("../services/facturaService.js");
    const facturas = await getAllFacturas();
    expect(Array.isArray(facturas)).toBe(true);
    for (const factura of facturas) {
      const parsed = FacturaSchema.safeParse(factura);
      expect(parsed.success).toBe(true);
    }
  });
});

describe("getFacturaById (mock)", () => {
  it("debe retornar una factura válida si existe", async () => {
    pool.query["mockResolvedValueOnce"]([[mockFacturas[0]]]);
    const { getFacturaById } = await import("../services/facturaService.js");
    const factura = await getFacturaById(1);
    expect(factura).toBeTruthy();
    const parsed = FacturaSchema.safeParse(factura);
    expect(parsed.success).toBe(true);
  });

  it("debe retornar null si la factura no existe", async () => {
    pool.query["mockResolvedValueOnce"]([[]]);
    const { getFacturaById } = await import("../services/facturaService.js");
    const factura = await getFacturaById(999999);
    expect(factura).toBeNull();
  });
});

describe("createFactura y deleteFactura (mock)", () => {
  it("debe crear y luego eliminar una factura", async () => {
    const facturaPrueba = {
      id: undefined,
      usuarioId: 3,
      fecha: new Date(),
      descripcion: "Factura de prueba",
      total: 150.75,
      metodoPago: /** @type {"tarjeta"} */ ("tarjeta"),
    };
    pool.query["mockResolvedValueOnce"]([{ insertId: 123 }]); // createFactura
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // deleteFactura
    const { createFactura, deleteFactura } = await import(
      "../services/facturaService.js"
    );
    const creada = await createFactura(facturaPrueba);
    expect(creada.id).toBeTruthy();
    expect(creada.descripcion).toBe(facturaPrueba.descripcion);
    const borrado = await deleteFactura(creada.id);
    expect(borrado.affectedRows).toBe(1);
  });
});

describe("updateFactura (mock)", () => {
  it("debe actualizar una factura existente", async () => {
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // updateFactura
    const { updateFactura } = await import("../services/facturaService.js");
    const nuevosDatos = {
      descripcion: "Factura actualizada",
      total: 200,
      metodoPago: /** @type {"tarjeta" | "transferencia"} */ ("transferencia"),
    };
    const result = await updateFactura(1, nuevosDatos);
    expect(result.affectedRows).toBe(1);
  });
});
