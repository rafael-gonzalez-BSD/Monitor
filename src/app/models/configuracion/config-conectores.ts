export class ConfigConectores {
  conectorConfiguracionId: number;
  conectorConfiguracionDescripcion: string;
  urlApi: string;
  frecuencia: number;
  horaDesde: string;
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
