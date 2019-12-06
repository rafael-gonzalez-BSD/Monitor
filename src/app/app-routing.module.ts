import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Layout1Component } from './layouts/layout1/layout1.component';
import { LayoutMobilComponent } from './layouts/layout-mobil/layout-mobil.component';
import { DashboardComponent } from './pages/dashboard-monitor/dashboard/dashboard.component';
import { ExcepcionesComponent } from './pages/dashboard-monitor/excepciones/excepciones.component';
import { DetalleExcepcionesComponent } from './pages/dashboard-monitor/detalle-excepciones/detalle-excepciones.component';
import { EjecucionesComponent } from './pages/dashboard-monitor/ejecuciones/ejecuciones.component';
import { MonitoreoComponent } from './pages/dashboard-monitor/monitoreo/monitoreo.component';
import { SistemasComponent } from './pages/inventario/sistemas/sistemas.component';
import { ProcesosComponent } from './pages/inventario/procesos/procesos.component';
import { DetalleEjecucionesComponent } from './pages/dashboard-monitor/detalle-ejecuciones/detalle-ejecuciones.component';
import { DetalleMonitoreoComponent } from './pages/dashboard-monitor/detalle-monitoreo/detalle-monitoreo.component';
import { MantenimientosComponent } from './pages/inventario/mantenimientos/mantenimientos.component';
import { MenuMovilComponent } from './components/menu-movil/menu-movil.component';

const rutasSite: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'menu', component: MenuMovilComponent },
  { path: 'excepciones', component: ExcepcionesComponent },
  { path: 'excepciones/:id', component: DetalleExcepcionesComponent },
  { path: 'ejecuciones', component: EjecucionesComponent },
  { path: 'ejecuciones/:id', component: DetalleEjecucionesComponent },
  { path: 'monitoreo', component: MonitoreoComponent },
  { path: 'monitoreo/:id', component: DetalleMonitoreoComponent },
  { path: 'sistemas', component: SistemasComponent },
  { path: 'procesos', component: ProcesosComponent },
  { path: 'mantenimientos', component: MantenimientosComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'dashboard' }
];

const routes: Routes = [
  {
    path: 'site',
    component: Layout1Component,
    children: rutasSite
  },
  { path: '**', pathMatch: 'full', redirectTo: 'site' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
