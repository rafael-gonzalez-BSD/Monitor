import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Importaciones de componentes de Material
import { MaterialModule } from './material.module';
import { Layout1Component } from './layouts/layout1/layout1.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { NavbarMovilComponent } from './components/navbar-movil/navbar-movil.component';
import { LayoutMobilComponent } from './layouts/layout-mobil/layout-mobil.component';
import { NavbarWebComponent } from './components/navbar-web/navbar-web.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb';

import { DashboardComponent } from './pages/dashboard-monitor/dashboard/dashboard.component';
import { ExcepcionesComponent } from './pages/dashboard-monitor/excepciones/excepciones.component';
import { EjecucionesComponent } from './pages/dashboard-monitor/ejecuciones/ejecuciones.component';
import { MonitoreoComponent } from './pages/dashboard-monitor/monitoreo/monitoreo.component';

import { DetalleExcepcionesComponent } from './pages/dashboard-monitor/detalle-excepciones/detalle-excepciones.component';
import { DetalleEjecucionesComponent } from './pages/dashboard-monitor/detalle-ejecuciones/detalle-ejecuciones.component';
import { DetalleMonitoreoComponent } from './pages/dashboard-monitor/detalle-monitoreo/detalle-monitoreo.component';

import { SistemasComponent } from './pages/inventario/sistemas/sistemas.component';
import { ProcesosComponent } from './pages/inventario/procesos/procesos.component';
import { MantenimientosComponent } from './pages/inventario/mantenimientos/mantenimientos.component';
import { ModalGuardarSistemaComponent } from './components/inventario/sistemas/modal-guardar-sistema/modal-guardar-sistema.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { GrillaProcesoComponent } from './components/inventario/procesos/grilla-proceso/grilla-proceso.component';
import { CintillaProcesoComponent } from './components/inventario/procesos/cintilla-proceso/cintilla-proceso.component';
import { ModalFiltrosSistemaComponent } from './components/inventario/sistemas/modal-filtros-sistema/modal-filtros-sistema.component';
import { ModalGuardarProcesoComponent } from './components/inventario/procesos/modal-guardar-proceso/modal-guardar-proceso.component';
import { ModalFiltrosProcesoComponent } from './components/inventario/procesos/modal-filtros-proceso/modal-filtros-proceso.component';
import { GrillaSistemaComponent } from './components/inventario/sistemas/grilla-sistema/grilla-sistema.component';
import { MenuMovilComponent } from './components/menu-movil/menu-movil.component';
import { LayoutBaseComponent } from './layouts/layout-base/layout-base.component';
import { ContenedorPrincipalComponent } from './components/contenedor-principal/contenedor-principal.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ConfigExcepcionesComponent } from './pages/configuracion/config-excepciones/config-excepciones.component';
import { ConfigEjecucionesComponent } from './pages/configuracion/config-ejecuciones/config-ejecuciones.component';
import { ConfigConectoresComponent } from './pages/configuracion/config-conectores/config-conectores.component';
import { LocationStrategy, HashLocationStrategy, registerLocaleData } from '@angular/common';
import { CintillaSistemaComponent } from './components/inventario/sistemas/cintilla-sistema/cintilla-sistema.component';
import { CintillaMantenimientosComponent } from './components/inventario/mantenimientos/cintilla-mantenimientos/cintilla-mantenimientos.component';
import { GrillaMantenimientoComponent } from './components/inventario/mantenimientos/grilla-mantenimiento/grilla-mantenimiento.component';
import { ModalGuardarMantenimientoComponent } from './components/inventario/mantenimientos/modal-guardar-mantenimiento/modal-guardar-mantenimiento.component';
import { ModalFiltrosMantenimientoComponent } from './components/inventario/mantenimientos/modal-filtros-mantenimiento/modal-filtros-mantenimiento.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { CintillaConfigExcepcionesComponent } from './components/configuracion/config-excepciones/cintilla-config-excepciones/cintilla-config-excepciones.component';
import { GrillaConfigExcepcionesComponent } from './components/configuracion/config-excepciones/grilla-config-excepciones/grilla-config-excepciones.component';
import { ModalFiltrosConfigExcepcionesComponent } from './components/configuracion/config-excepciones/modal-filtros-config-excepciones/modal-filtros-config-excepciones.component';
import { ModalGuardarConfigExcepcionesComponent } from './components/configuracion/config-excepciones/modal-guardar-config-excepciones/modal-guardar-config-excepciones.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { options } from './NotifierOptions';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { HourFormatPipe } from './pipes/time/hour-format.pipe';
import { CintillaConfigEjecucionesComponent } from './components/configuracion/config-ejecuciones/cintilla-config-ejecuciones/cintilla-config-ejecuciones.component';
import { GrillaConfigEjecucionesComponent } from './components/configuracion/config-ejecuciones/grilla-config-ejecuciones/grilla-config-ejecuciones.component';
import { ModalFiltrosConfigEjecucionesComponent } from './components/configuracion/config-ejecuciones/modal-filtros-config-ejecuciones/modal-filtros-config-ejecuciones.component';
import { ModalGuardarConfigEjecucionesComponent } from './components/configuracion/config-ejecuciones/modal-guardar-config-ejecuciones/modal-guardar-config-ejecuciones.component';
import { ModalGuardarConfigConectoresComponent } from './components/configuracion/config-conectores/modal-guardar-config-conectores/modal-guardar-config-conectores.component';
import { ModalFiltrosConfigConectoresComponent } from './components/configuracion/config-conectores/modal-filtros-config-conectores/modal-filtros-config-conectores.component';
import { CintillaConfigConectoresComponent } from './components/configuracion/config-conectores/cintilla-config-conectores/cintilla-config-conectores.component';
import { GrillaConfigConectoresComponent } from './components/configuracion/config-conectores/grilla-config-conectores/grilla-config-conectores.component';
import { ModalFiltrosDashboardComponent } from './components/dashboard-monitor/dashboard/modal-filtros-dashboard/modal-filtros-dashboard.component';
import { CintillaDashboardComponent } from './components/dashboard-monitor/dashboard/cintilla-dashboard/cintilla-dashboard.component';
import { GraficoExcepcionesComponent } from './components/dashboard-monitor/dashboard/grafico-excepciones/grafico-excepciones.component';
import { GraficoEjecucionesComponent } from './components/dashboard-monitor/dashboard/grafico-ejecuciones/grafico-ejecuciones.component';
import { GraficoConectoresComponent } from './components/dashboard-monitor/dashboard/grafico-conectores/grafico-conectores.component';
import { ModalFiltroBitacoraExcepcionesComponent } from './components/dashboard-monitor/bitacora-excepciones/modal-filtro-bitacora-excepciones/modal-filtro-bitacora-excepciones.component';
import { CintillaBitacoraExcepcionesComponent } from './components/dashboard-monitor/bitacora-excepciones/cintilla-bitacora-excepciones/cintilla-bitacora-excepciones.component';
import { GrillaBitacoraExcepcionesComponent } from './components/dashboard-monitor/bitacora-excepciones/grilla-bitacora-excepciones/grilla-bitacora-excepciones.component';
import { GrillaBitacoraEjecucionesComponent } from './components/dashboard-monitor/bitacora-ejecuciones/grilla-bitacora-ejecuciones/grilla-bitacora-ejecuciones.component';
import { ModalFiltroBitacoraEjecucionesComponent } from './components/dashboard-monitor/bitacora-ejecuciones/modal-filtro-bitacora-ejecuciones/modal-filtro-bitacora-ejecuciones.component';
import { CintillaBitacoraEjecucionesComponent } from './components/dashboard-monitor/bitacora-ejecuciones/cintilla-bitacora-ejecuciones/cintilla-bitacora-ejecuciones.component';
import { CintillaBitacoraConectoresComponent } from './components/dashboard-monitor/bitacora-conectores/cintilla-bitacora-conectores/cintilla-bitacora-conectores.component';
import { ModalFiltroBitacoraConectoresComponent } from './components/dashboard-monitor/bitacora-conectores/modal-filtro-bitacora-conectores/modal-filtro-bitacora-conectores.component';
import { GrillaBitacoraConectoresComponent } from './components/dashboard-monitor/bitacora-conectores/grilla-bitacora-conectores/grilla-bitacora-conectores.component';

import { NgxLoadingModule } from 'ngx-loading';

// Angular DataTable
import { DataTablesModule } from 'angular-datatables';
import { GrillaDetalleExcepcionesComponent } from './components/dashboard-monitor/detalle-excepciones/grilla-detalle-excepciones/grilla-detalle-excepciones.component';
import { GrillaDetalleEjecucionesComponent } from './components/dashboard-monitor/detalle-ejecuciones/grilla-detalle-ejecuciones/grilla-detalle-ejecuciones.component';
import { GrillaDetalleConectoresComponent } from './components/dashboard-monitor/detalle-conectores/grilla-detalle-conectores/grilla-detalle-conectores.component';
import { ModalLogExcepcionesComponent } from './components/dashboard-monitor/detalle-excepciones/modal-log-excepciones/modal-log-excepciones.component';
/**
 * Custom angular notifier options
 */

 // Language
 import localeEs from '@angular/common/locales/es';

 // usar DatePipe
 import { DatePipe } from '@angular/common';

registerLocaleData(localeEs, 'es');

const customNotifierOptions: NotifierOptions = options

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MMM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    Layout1Component,
    SideBarComponent,
    NavbarMovilComponent,
    LayoutMobilComponent,
    NavbarWebComponent,
    BreadcrumbComponent,
    DashboardComponent,
    ExcepcionesComponent,
    DetalleExcepcionesComponent,
    DetalleEjecucionesComponent,
    DetalleMonitoreoComponent,
    EjecucionesComponent,
    MonitoreoComponent,
    SistemasComponent,
    ProcesosComponent,
    MantenimientosComponent,
    ModalGuardarSistemaComponent,
    GrillaProcesoComponent,
    CintillaProcesoComponent,
    ModalFiltrosSistemaComponent,
    ModalGuardarProcesoComponent,
    ModalFiltrosProcesoComponent,
    GrillaSistemaComponent,
    MenuMovilComponent,
    LayoutBaseComponent,
    ContenedorPrincipalComponent,
    ConfigExcepcionesComponent,
    ConfigEjecucionesComponent,
    ConfigConectoresComponent,
    CintillaSistemaComponent,
    CintillaMantenimientosComponent,
    GrillaMantenimientoComponent,
    ModalGuardarMantenimientoComponent,
    ModalFiltrosMantenimientoComponent,
    LoaderComponent,
    CintillaConfigExcepcionesComponent,
    GrillaConfigExcepcionesComponent,
    ModalFiltrosConfigExcepcionesComponent,
    ModalGuardarConfigExcepcionesComponent,
    HourFormatPipe,
    CintillaConfigEjecucionesComponent,
    GrillaConfigEjecucionesComponent,
    ModalFiltrosConfigEjecucionesComponent,
    ModalGuardarConfigEjecucionesComponent,
    ModalGuardarConfigConectoresComponent,
    ModalFiltrosConfigConectoresComponent,
    CintillaConfigConectoresComponent,
    GrillaConfigConectoresComponent,
    ModalFiltrosDashboardComponent,
    CintillaDashboardComponent,
    GraficoExcepcionesComponent,
    GraficoEjecucionesComponent,
    GraficoConectoresComponent,
    ModalFiltroBitacoraExcepcionesComponent,
    CintillaBitacoraExcepcionesComponent,
    GrillaBitacoraExcepcionesComponent,
    GrillaBitacoraEjecucionesComponent,
    ModalFiltroBitacoraEjecucionesComponent,
    CintillaBitacoraEjecucionesComponent,
    CintillaBitacoraConectoresComponent,
    ModalFiltroBitacoraConectoresComponent,
    GrillaBitacoraConectoresComponent,
    GrillaDetalleExcepcionesComponent,
    GrillaDetalleEjecucionesComponent,
    GrillaDetalleConectoresComponent,
    ModalLogExcepcionesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    BreadcrumbModule,
    Ng7BootstrapBreadcrumbModule,
    HttpClientModule,
    ReactiveFormsModule,
    LayoutModule,
    NotifierModule.withConfig(customNotifierOptions),
    NgxMaterialTimepickerModule,
    DataTablesModule,
    NgxLoadingModule.forRoot({})
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe,
    HourFormatPipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalGuardarSistemaComponent,
    ModalFiltrosSistemaComponent,
    ModalGuardarProcesoComponent,
    ModalFiltrosProcesoComponent,
    ModalFiltrosMantenimientoComponent,
    ModalGuardarMantenimientoComponent,
    ModalFiltrosConfigExcepcionesComponent,
    ModalGuardarConfigExcepcionesComponent,
    ModalFiltrosConfigEjecucionesComponent,
    ModalGuardarConfigEjecucionesComponent,
    ModalFiltrosConfigConectoresComponent,
    ModalGuardarConfigConectoresComponent,
    ModalFiltrosDashboardComponent,
    ModalFiltroBitacoraExcepcionesComponent,
    ModalLogExcepcionesComponent,
    ModalFiltroBitacoraEjecucionesComponent,
    ModalFiltroBitacoraConectoresComponent
  ]
})
export class AppModule { }
