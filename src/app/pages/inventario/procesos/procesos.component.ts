import { ProcesoService } from './../../../services/inventario/proceso.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { ModalGuardarProcesoComponent } from '../../../components/inventario/procesos/modal-guardar-proceso/modal-guardar-proceso.component';
// tslint:disable-next-line: max-line-length
import { ModalFiltrosProcesoComponent } from '../../../components/inventario/procesos/modal-filtros-proceso/modal-filtros-proceso.component';
import { SistemaService } from '../../../services/inventario/sistema.service';
import { Proceso } from 'src/app/models/inventario/proceso';
import { Sistema } from 'src/app/models/inventario/sistema';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.scss']
})
export class ProcesosComponent implements OnInit {
  constructor(private procesoService: ProcesoService, private sistemaService: SistemaService, private modal: MatDialog) {}

  ngOnInit() {}

  abrirModalFiltros() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Filtros',
      opcion: 4
    };
    dialogConfig.height = 'auto';
    dialogConfig.width = '70%';
    dialogConfig.maxWidth = '768px';
    this.procesoService.consultarProcesoCombo(new Proceso(3)).subscribe(res => {
      dialogConfig.data.datosComboProceso = res;
      this.sistemaService.consultarSistemaCombo(new Sistema(3)).subscribe(res2 => {
        dialogConfig.data.datosComboSistema = res2;
        this.modal.open(ModalFiltrosProcesoComponent, dialogConfig);
      });
    });
  }
}
