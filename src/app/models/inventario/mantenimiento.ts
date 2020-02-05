export class Mantenimiento {
  ventanaMantenimientoId: number;
  fechaDesde: Date;
  horaDesde: string;
  fechaHasta: Date;
  horaHasta: string;
  usuarioCreacionId: number;
  fechaCreacion: string;
  usuarioModificacionId: number;
  fechaModificacion: string;
  usuarioBajaId: number | null;
  fechaBaja: string | null;
  baja: boolean;
  sistemaId: number;
  sistemaDescripcion: string;
  sistemaBaja: boolean;
  opcion: number;
}
