import { describe, expect, it, vi, beforeEach } from "vitest";
import { PedidoDisponibilidadSchema } from "../types/schemas.js";

const mockDisponibilidad = [
  {
    id: 1,
    pedidoId: 1,
    clienteId: 1,
    dia: "lunes",
    horaInicio: "09:00",
    horaFin: "12:00",
  },
  {
    id: 2,
    pedidoId: 2,
    clienteId: 2,
    dia: "martes",
    horaInicio: "14:00",
    horaFin: "18:00",
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

describe("getAllPedidoDisponibilidad (mock)", () => {
  it("debe retornar un array de disponibilidades válidas", async () => {
    pool.query["mockResolvedValueOnce"]([mockDisponibilidad]);
    const { getAllPedidoDisponibilidad } = await import(
      "../services/pedidoDisponibilidadService.js"
    );
    const disponibilidades = await getAllPedidoDisponibilidad();
    expect(Array.isArray(disponibilidades)).toBe(true);
    for (const disp of disponibilidades) {
      const parsed = PedidoDisponibilidadSchema.safeParse(disp);
      expect(parsed.success).toBe(true);
    }
  });
});

describe("getPedidoDisponibilidadById (mock)", () => {
  it("debe retornar una disponibilidad válida si existe", async () => {
    pool.query["mockResolvedValueOnce"]([[mockDisponibilidad[0]]]);
    const { getPedidoDisponibilidadById } = await import(
      "../services/pedidoDisponibilidadService.js"
    );
    const disp = await getPedidoDisponibilidadById(1);
    expect(disp).toBeTruthy();
    const parsed = PedidoDisponibilidadSchema.safeParse(disp);
    expect(parsed.success).toBe(true);
  });

  it("debe retornar null si no existe", async () => {
    pool.query["mockResolvedValueOnce"]([[]]);
    const { getPedidoDisponibilidadById } = await import(
      "../services/pedidoDisponibilidadService.js"
    );
    const disp = await getPedidoDisponibilidadById(999999);
    expect(disp).toBeNull();
  });
});

describe("createPedidoDisponibilidad y deletePedidoDisponibilidad (mock)", () => {
  it("debe crear y luego eliminar una disponibilidad", async () => {
    const dispPrueba = {
      id: undefined,
      pedidoId: 3,
      clienteId: 3,
      dia: "miércoles",
      horaInicio: "10:00",
      horaFin: "13:00",
    };
    pool.query["mockResolvedValueOnce"]([{ insertId: 123 }]); // create
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // delete
    const { createPedidoDisponibilidad, deletePedidoDisponibilidad } =
      await import("../services/pedidoDisponibilidadService.js");
    // @ts-ignore
    const creada = await createPedidoDisponibilidad(dispPrueba);
    expect(creada.id).toBeTruthy();
    expect(creada.pedidoId).toBe(dispPrueba.pedidoId);
    const borrado = await deletePedidoDisponibilidad(creada.id);
    expect(borrado.affectedRows).toBe(1);
  });
});

describe("updatePedidoDisponibilidad (mock)", () => {
  it("debe actualizar una disponibilidad existente", async () => {
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // update
    const { updatePedidoDisponibilidad } = await import(
      "../services/pedidoDisponibilidadService.js"
    );
    const nuevosDatos = {
      dia: "jueves",
      horaInicio: "15:00",
      horaFin: "18:00",
    };
    // @ts-ignore
    const result = await updatePedidoDisponibilidad(1, nuevosDatos);
    expect(result.affectedRows).toBe(1);
  });
});
