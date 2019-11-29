import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigExcepcionesComponent } from './config-excepciones.component';

describe('ConfigExcepcionesComponent', () => {
  let component: ConfigExcepcionesComponent;
  let fixture: ComponentFixture<ConfigExcepcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigExcepcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigExcepcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
