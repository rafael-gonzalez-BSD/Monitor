import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleExcepcionesComponent } from './detalle-excepciones.component';

describe('DetalleExcepcionesComponent', () => {
  let component: DetalleExcepcionesComponent;
  let fixture: ComponentFixture<DetalleExcepcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleExcepcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleExcepcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
