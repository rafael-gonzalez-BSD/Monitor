import { Opcion } from '../base/opcion';
export class Sistema extends Opcion {
  sistemaId: number;
  sistemaDescripcion: string;
  baja: boolean;
  alias: string;
  gerenciaId: number;
  descripcion: string;
  opcion: number;

  constructor(opcion?: number) {
    super();
    this.opcion = opcion || 0;
  }
}
