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
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
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
        MatInputModule
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
        MatInputModule
    ]
})
export class MaterialModule{}