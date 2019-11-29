import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGuardarSistemaComponent } from './modal-guardar-sistema.component';

describe('ModalGuardarSistemaComponent', () => {
  let component: ModalGuardarSistemaComponent;
  let fixture: ComponentFixture<ModalGuardarSistemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGuardarSistemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGuardarSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
