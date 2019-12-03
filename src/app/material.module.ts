import { NgModule } from '@angular/core';
import { getLangPaginatorIntl } from './components/inventario/procesos/grilla-proceso/grilla-proceso-lang';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatGridListModule,
  MatDividerModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatListModule,
  MatTreeModule,
  MatTabsModule,
  MatSelectModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatPaginatorIntl,
  MatSortModule,
  MatPaginator
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatGridListModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatListModule,
    MatTreeModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatGridListModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatListModule,
    MatTreeModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [{ provide: MatPaginatorIntl, useValue: getLangPaginatorIntl() }]
})
export class MaterialModule {}
