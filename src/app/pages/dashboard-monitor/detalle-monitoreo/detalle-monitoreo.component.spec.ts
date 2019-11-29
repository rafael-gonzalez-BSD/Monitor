import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMonitoreoComponent } from './detalle-monitoreo.component';

describe('DetalleMonitoreoComponent', () => {
  let component: DetalleMonitoreoComponent;
  let fixture: ComponentFixture<DetalleMonitoreoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleMonitoreoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleMonitoreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
