import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

// import { FontAwesomeModule } from '../../node_modules/@fortawesome/fontawesome-free';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfigExcepcionesComponent } from './pages/configuracion/config-excepciones/config-excepciones.component';
import { ConfigEjecucionesComponent } from './pages/configuracion/config-ejecuciones/config-ejecuciones.component';
import { ConfigConectoresComponent } from './pages/configuracion/config-conectores/config-conectores.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CintillaSistemaComponent } from './components/inventario/sistemas/cintilla-sistema/cintilla-sistema.component';
import { CintillaMantenimientosComponent } from './components/inventario/mantenimientos/cintilla-mantenimientos/cintilla-mantenimientos.component';
import { GrillaMantenimientoComponent } from './components/inventario/mantenimientos/grilla-mantenimiento/grilla-mantenimiento.component';
import { ModalGuardarMantenimientoComponent } from './components/inventario/mantenimientos/modal-guardar-mantenimiento/modal-guardar-mantenimiento.component';
import { ModalFiltrosMantenimientoComponent } from './components/inventario/mantenimientos/modal-filtros-mantenimiento/modal-filtros-mantenimiento.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'middle',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: false
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
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
    // ng-pick-datetime
    OwlDateTimeModule,
    OwlNativeDateTimeModule,

    BsDatepickerModule.forRoot(),
  ],
  providers: [
    // LoaderService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'es'},
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalGuardarSistemaComponent,
    ModalFiltrosSistemaComponent,
    ModalGuardarProcesoComponent,
    ModalFiltrosProcesoComponent,
    ModalFiltrosMantenimientoComponent,
    ModalGuardarMantenimientoComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
