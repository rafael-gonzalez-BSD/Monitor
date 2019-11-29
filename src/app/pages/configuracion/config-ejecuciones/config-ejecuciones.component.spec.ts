import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigEjecucionesComponent } from './config-ejecuciones.component';

describe('ConfigEjecucionesComponent', () => {
  let component: ConfigEjecucionesComponent;
  let fixture: ComponentFixture<ConfigEjecucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigEjecucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigEjecucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
