export class Proceso {
    procesoId: number;
    procesoDescripcion: string;
    critico: boolean;
    usuarioCreacionId: number;
    fechaCreacion: string;
    usuarioModificacionId: number;
    fechaModificacion: string;
    usuarioBajaId: number | null;
    fechaBaja: string | null;
    baja: boolean;
    sistemaId: number;
    sistemaDescripcion: string;
    opcion: number;
}
