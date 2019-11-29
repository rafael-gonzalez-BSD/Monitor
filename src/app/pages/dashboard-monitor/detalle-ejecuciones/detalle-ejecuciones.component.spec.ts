import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEjecucionesComponent } from './detalle-ejecuciones.component';

describe('DetalleEjecucionesComponent', () => {
  let component: DetalleEjecucionesComponent;
  let fixture: ComponentFixture<DetalleEjecucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleEjecucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleEjecucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
