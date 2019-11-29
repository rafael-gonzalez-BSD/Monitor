import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecucionesComponent } from './ejecuciones.component';

describe('EjecucionesComponent', () => {
  let component: EjecucionesComponent;
  let fixture: ComponentFixture<EjecucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EjecucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EjecucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
