export class NotificacionModel {
  tipo: string;
  mensaje: string;

  constructor(tipo?: string, mensaje?: string) {
    this.tipo = tipo || 'info';
    this.mensaje = mensaje || 'Mensaje de Prueba';
  }
}
