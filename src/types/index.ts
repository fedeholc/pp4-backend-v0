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

export type FacturaMetodoPago = 'tarjeta' | 'transferencia';

export type Factura = {
  id: number | null;
  usuarioId: number | null;
  fecha: Date | null;
  descripcion: string | null;
  total: number | null; // DECIMAL maps to number in TypeScript
  metodoPago: FacturaMetodoPago | null;
};

export type TecnicoConAreas = Tecnico & {
  areas: Area[] | null;
};


export type PedidoConCliente = Pedido & {
  cliente: Cliente | null;
};


