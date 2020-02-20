export class ConfigEjecuciones {
  ejecucionConfiguracionId: number;
  frecuencia: number;
  horaDesde: string;
  horaHasta: string;
  rutaLog: string;
  tiempoEstimadoEjecucion: number;
  tiempoOptimoEjecucion: number;
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
  procesoId: number;
  procesoDescripcion: string;
  procesoBaja: boolean;
  ventanaMantenimiento: string | null;
  opcion: number;
  archivoTest:string;
}
