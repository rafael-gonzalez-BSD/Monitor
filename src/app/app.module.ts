import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
import { HttpClientModule } from '@angular/common/http';
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
    ContenedorPrincipalComponent
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
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalGuardarSistemaComponent,
    ModalFiltrosSistemaComponent,
    ModalGuardarProcesoComponent,
    ModalFiltrosProcesoComponent
  ]
})
export class AppModule {}
