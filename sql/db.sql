-- db v0.2
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS pp4;
ALTER DATABASE pp4 CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci;
USE pp4;

-- Evitar conflictos de claves externas al recrear
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar tablas si existen
DROP TABLE IF EXISTS Factura;
DROP TABLE IF EXISTS PedidoDisponibilidad;
DROP TABLE IF EXISTS PedidoCandidatos;
DROP TABLE IF EXISTS Pedido;
DROP TABLE IF EXISTS TecnicoAreas;
DROP TABLE IF EXISTS Tecnico;
DROP TABLE IF EXISTS Cliente;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Areas;

-- Crear tablas base
CREATE TABLE Areas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    descripcion TEXT
);

CREATE TABLE Usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    rol ENUM('cliente', 'tecnico', 'admin')
);

CREATE TABLE Cliente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuarioId INT,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuarioId) REFERENCES Usuario(id)
);

CREATE TABLE Tecnico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuarioId INT,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    caracteristicas TEXT,
    fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuarioId) REFERENCES Usuario(id)
);

CREATE TABLE TecnicoAreas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tecnicoId INT,
    areaId INT,
    FOREIGN KEY (tecnicoId) REFERENCES Tecnico(id),
    FOREIGN KEY (areaId) REFERENCES Areas(id)
);

-- Tabla de pedidos
CREATE TABLE Pedido (
    id int PRIMARY KEY,
    clienteId int,
    tecnicoId int, 
    estado ENUM('sin_candidatos', 'con_candidatos', 'tecnico_seleccionado', 'cancelado', 'finalizado', 'calificado') DEFAULT 'sin_candidatos',
    areaId int,
    requerimiento TEXT,
    calificacion int, --del 1 al 5?
    comentario TEXT,--calificaión-comentario 
    respuesta TEXT, --feedback del tecnico
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaCierre DATETIME,
    fechaCancelado DATETIME, --cancelado por el cliente 
    FOREIGN KEY (clienteId) REFERENCES Cliente(id),
    FOREIGN KEY (tecnicoId) REFERENCES Tecnico(id),
    FOREIGN KEY (areaId) REFERENCES Areas(id)
);

--Tabla de disponibilidad que dan los clientes 
CREATE TABLE PedidoDisponibilidad (
    id int PRIMARY KEY,
    pedidoId int,
    clienteId int,
    dia ENUM('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'),
    horaInicio TIME,
    horaFin TIME,
    FOREIGN KEY (clienteId) REFERENCES Cliente(id),
    FOREIGN KEY (pedidoId) REFERENCES Pedido(id)
);

-- Tabla de candidatos a un pedido
CREATE TABLE PedidoCandidatos (
    id int PRIMARY KEY,
    pedidoId int,
    tecnicoId int,
    FOREIGN KEY (pedidoId) REFERENCES Pedido(id),
    FOREIGN KEY (tecnicoId) REFERENCES Tecnico(id)
);

 
-- Tabla de facturas
CREATE TABLE Factura (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuarioId INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    total DECIMAL(10,2),
    metodoPago ENUM('tarjeta', 'transferencia'),
    FOREIGN KEY (usuarioId) REFERENCES Usuario(id)
);


-- Insert de prueba
INSERT INTO Areas (id, nombre, descripcion) VALUES 
(1, 'Electricidad', 'Servicios eléctricos generales');

INSERT INTO Usuario (id, email, password, rol) VALUES
(1, 'cliente@test.com', '1234', 'cliente'),
(2, 'tecnico@test.com', '1234', 'tecnico');

INSERT INTO Cliente (id, usuarioId, nombre, apellido, telefono, direccion) VALUES
(1, 1, 'Juan', 'Pérez', '1122334455', 'Av. Siempre Viva 123');

INSERT INTO Tecnico (id, usuarioId, nombre, apellido, telefono, direccion, caracteristicas) VALUES
(1, 2, 'Carlos', 'Gómez', '1199887766', 'Calle Falsa 456', 'Especialista en instalaciones domiciliarias');

INSERT INTO TecnicoAreas (id, tecnicoId, areaId) VALUES 
(1, 1, 1);

INSERT INTO Pedido (id, clienteId, descripcion, estado) VALUES
(1, 1, 'Reparación de toma corriente', 'pendiente');

INSERT INTO Factura (id, usuarioId, descripcion, total, metodoPago) VALUES
(1, 2, 'Suscripción Cuota 1', 3500.00, 'tarjeta');
 
-- Reactivar claves foráneas
SET FOREIGN_KEY_CHECKS = 1;
