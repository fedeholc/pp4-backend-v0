export type Area = {
  id: number | null;
  nombre: string | null;
  descripcion: string | null;
};

export type UsuarioRol = 'cliente' | 'tecnico' | 'admin';

export type Usuario = {
  id: number | null;
  email: string | null;
  password?: string | null;
  rol: UsuarioRol | null;
};

export type Cliente = {
  id: number | null;
  usuarioId: number | null;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
  direccion: string | null;
  fechaRegistro: Date | null;
};

export type Tecnico = {
  id: number | null;
  usuarioId: number | null;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
  direccion: string | null;
  caracteristicas: string | null;
  fechaRegistro: Date | null;
};

export type TecnicoArea = {
  id: number | null;
  tecnicoId: number | null;
  areaId: number | null;
};

export type PedidoEstado = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';

export type Pedido = {
  id: number | null;
  clienteId: number | null;
  descripcion: string | null;
  fechaSolicitud: Date | null;
  estado: PedidoEstado | null;
};

export type FacturaMetodoPago = 'efectivo' | 'tarjeta' | 'transferencia';

export type Factura = {
  id: number | null;
  pedidoId: number | null;
  fecha: Date | null;
  total: number | null; // DECIMAL maps to number in TypeScript
  metodoPago: FacturaMetodoPago | null;
};

export type FacturaDetalle = {
  id: number | null;
  facturaId: number | null;
  descripcion: string | null;
  cantidad: number | null;
  precioUnitario: number | null; // DECIMAL maps to number
};


export type TecnicoConAreas = Tecnico & {
  areas: Area[] | null;
};


export type PedidoConCliente = Pedido & {
  cliente: Cliente | null;
};


export type FacturaCompleta = Factura & {
  detalles: FacturaDetalle[] | null;
  pedido?: Pedido | null; // Optional and nullable
  cliente?: Cliente | null; // Optional and nullable
};