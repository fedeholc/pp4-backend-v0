import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { app } from "../server.js"; // Asegúrate de exportar tu instancia de Express desde server.js

let tokenAdmin;
let tokenCliente;
let clienteCreadoId;

 
beforeAll(async () => {
  // Login como admin y cliente para obtener tokens
  const resAdmin = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@test.com", password: "1234" });
  tokenAdmin = resAdmin.body.token;

  const resCliente = await request(app)
    .post("/api/auth/login")
    .send({ email: "cliente@test.com", password: "1234" });
  tokenCliente = resCliente.body.token;
});

describe("Rutas /api/clientes", () => {
  it("GET /api/clientes requiere autenticación", async () => {
    const res = await request(app).get("/api/clientes");
    expect(res.status).toBe(401);
  });

  it("GET /api/clientes devuelve clientes con token válido", async () => {
    const res = await request(app)
      .get("/api/clientes")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/clientes crea un cliente", async () => {
    // Primero crea un usuario para asociar al cliente
    const usuarioRes = await request(app)
      .post("/api/usuarios")
      .send({
        email: `testcliente${Date.now()}@mail.com`,
        password: "testpass",
        rol: "cliente",
      });
    const usuarioId = usuarioRes.body.id;

    const res = await request(app)
      .post("/api/clientes")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        usuarioId,
        nombre: "TestNombre",
        apellido: "TestApellido",
        telefono: "123456789",
        direccion: "TestDireccion",
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    clienteCreadoId = res.body.id;
  });

  it("GET /api/clientes/:id devuelve un cliente existente", async () => {
    const res = await request(app)
      .get(`/api/clientes/${clienteCreadoId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", clienteCreadoId);
  });

  it("PUT /api/clientes/:id actualiza un cliente", async () => {
    const res = await request(app)
      .put(`/api/clientes/${clienteCreadoId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        nombre: "NombreActualizado",
        apellido: "ApellidoActualizado",
        telefono: "987654321",
        direccion: "DireccionActualizada",
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Cliente actualizado");
  });

  it("DELETE /api/clientes/:id elimina un cliente (solo admin)", async () => {
    const res = await request(app)
      .delete(`/api/clientes/${clienteCreadoId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Cliente eliminado");
  });

  it("DELETE /api/clientes/:id deniega acceso a no admin", async () => {
    // Crea un cliente para este test
    const usuarioRes = await request(app)
      .post("/api/usuarios")
      .send({
        email: `testcliente${Date.now()}@mail.com`,
        password: "testpass",
        rol: "cliente",
      });
    const usuarioId = usuarioRes.body.id;
    const clienteRes = await request(app)
      .post("/api/clientes")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        usuarioId,
        nombre: "TestNombre2",
        apellido: "TestApellido2",
        telefono: "123456789",
        direccion: "TestDireccion2",
      });
    const id = clienteRes.body.id;

    const res = await request(app)
      .delete(`/api/clientes/${id}`)
      .set("Authorization", `Bearer ${tokenCliente}`);
    expect(res.status).toBe(403);
  });
});
