import { describe, expect, it, vi, beforeEach } from "vitest";
import { PedidoSchema } from "../types/schemas.js";

const mockPedidos = [
  {
    id: 1,
    clienteId: 1,
    tecnicoId: 1,
    areaId: 1,
    estado: "sin_candidatos",
    requerimiento: "Reparar PC",
    calificacion: 5,
    comentario: "Todo bien",
    respuesta: "Listo",
    fechaCreacion: new Date(),
    fechaCierre: new Date(),
    fechaCancelado: null,
  },
  {
    id: 2,
    clienteId: 2,
    tecnicoId: 2,
    areaId: 2,
    estado: "con_candidatos",
    requerimiento: "Instalar software",
    calificacion: 4,
    comentario: "Rápido",
    respuesta: "Hecho",
    fechaCreacion: new Date(),
    fechaCierre: null,
    fechaCancelado: null,
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

describe("getAllPedidos (mock)", () => {
  it("debe retornar un array de pedidos válidos", async () => {
    // Mock the first query: SELECT * FROM Pedido
    pool.query["mockResolvedValueOnce"]([
      [
        {
          id: 1,
          clienteId: 1,
          tecnicoId: 1,
          areaId: 1,
          requerimiento: "req",
          estado: "sin_candidatos",
          calificacion: 5,
          comentario: "comentario",
          respuesta: "respuesta",
          fechaCreacion: new Date("2024-01-01T00:00:00.000Z"),
          fechaCierre: null,
          fechaCancelado: null,
        },
      ],
    ]);
    // Mock the second query: SELECT * FROM PedidoDisponibilidad WHERE pedidoId = ?
    pool.query["mockResolvedValueOnce"]([
      [
        {
          id: 1,
          pedidoId: 1,
          clienteId: 1,
          dia: "lunes",
          horaInicio: "10:00",
          horaFin: "12:00",
        },
      ],
    ]);
    // Mock the third query: SELECT * FROM PedidoCandidatos WHERE pedidoId = ?
    pool.query["mockResolvedValueOnce"]([
      [
        {
          id: 1,
          pedidoId: 1,
          tecnicoId: 1,
          estado: "pendiente",
        },
      ],
    ]);
    // Mock Cliente
    pool.query["mockResolvedValueOnce"]([
      [
        {
          id: 1,
          usuarioId: 10,
          nombre: "Cliente 1",
          apellido: "ApellidoCliente",
          email: "cliente1@example.com",
          telefono: "123456789",
          direccion: "Calle Falsa 123",
          fechaRegistro: new Date("2023-01-01T00:00:00.000Z"),
        },
      ],
    ]);
    // Mock Tecnico
    pool.query["mockResolvedValueOnce"]([
      [
        {
          id: 1,
          usuarioId: 20,
          nombre: "Tecnico 1",
          apellido: "ApellidoTecnico",
          email: "tecnico1@example.com",
          telefono: "987654321",
          direccion: "Avenida Siempre Viva 742",
          caracteristicas: "Responsable, puntual",
          fechaRegistro: new Date("2022-01-01T00:00:00.000Z"),
        },
      ],
    ]);
    // Mock Area
    pool.query["mockResolvedValueOnce"]([
      [
        {
          id: 1,
          nombre: "Area 1",
          descripcion: "Desc 1",
        },
      ],
    ]);
    // Mock calificaciones for candidato
    pool.query["mockResolvedValueOnce"]([[]]); // or e.g. [[{ calificacion: 5 }]]
    const { getAllPedidos } = await import("../services/pedidoService.js");
    const pedidos = await getAllPedidos();
    expect(Array.isArray(pedidos)).toBe(true);
    expect(pedidos.length).toBeGreaterThan(0);
    expect(pedidos[0].id).toBe(1);
    expect(pedidos[0].disponibilidad).toBeDefined();
    expect(pedidos[0].candidatos).toBeDefined();
  });
});

describe("getPedidoById (mock)", () => {
  it("debe retornar un pedido válido si existe", async () => {
    pool.query["mockResolvedValueOnce"]([[mockPedidos[0]]]);
    const { getPedidoById } = await import("../services/pedidoService.js");
    const pedido = await getPedidoById(1);
    expect(pedido).toBeTruthy();
    const parsed = PedidoSchema.safeParse(pedido);
    expect(parsed.success).toBe(true);
  });

  it("debe retornar null si el pedido no existe", async () => {
    pool.query["mockResolvedValueOnce"]([[]]);
    const { getPedidoById } = await import("../services/pedidoService.js");
    const pedido = await getPedidoById(999999);
    expect(pedido).toBeNull();
  });
});

describe("createPedido y deletePedido (mock)", () => {
  it("debe crear y luego eliminar un pedido", async () => {
    const pedidoPrueba = {
      id: undefined,
      clienteId: 1,
      tecnicoId: 1,
      areaId: 1,
      estado: "sin_candidatos", // use allowed enum value
      requerimiento: "req",
      calificacion: 5,
      comentario: "comentario",
      respuesta: "respuesta",
      fechaCreacion: new Date(),
      fechaCierre: null,
      fechaCancelado: null,
    };
    pool.query["mockResolvedValueOnce"]([{ insertId: 123 }]); // createPedido
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // deletePedido
    const { createPedido, deletePedido } = await import(
      "../services/pedidoService.js"
    );
    const creada = await createPedido({
      ...pedidoPrueba,
      estado: "sin_candidatos",
    });
    expect(creada.id).toBeTruthy();
    expect(creada.requerimiento).toBe(pedidoPrueba.requerimiento);
    const borrado = await deletePedido(creada.id);
    expect(borrado.affectedRows).toBe(1);
  });
});

describe("updatePedido (mock)", () => {
  it("debe actualizar un pedido existente", async () => {
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // updatePedido
    const { updatePedido } = await import("../services/pedidoService.js");
    const nuevosDatos = {
      requerimiento: "Nuevo requerimiento",
      estado: "con_candidatos", // use allowed enum value
    };
    const result = await updatePedido(1, {
      ...nuevosDatos,
      estado: "con_candidatos",
    });
    expect(result.affectedRows).toBe(1);
  });
});
