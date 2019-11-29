import { NgModule } from '@angular/core';

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
    MatTabsModule
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
        MatTabsModule
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
        MatTabsModule
    ]
})
export class MaterialModule{}