export class Mantenimiento {
    ventanaMantenimientoId: number;
    fechaDesde: any;
    fechaHasta: any;
    usuarioCreacionId: number;
    fechaCreacion: any;
    usuarioModificacionId: number;
    fechaModificacion: any;
    usuarioBajaId: number;
    fechaBaja: any;
    baja: boolean;
    sistemaId: any;
    sistemaDescripcion: string;
    opcion: number;

    constructor(opcion?: number) {
        this.opcion = opcion || 0;
    }
}
