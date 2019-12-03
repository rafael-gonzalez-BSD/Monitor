import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGuardarProcesoComponent } from './modal-guardar-proceso.component';

describe('ModalGuardarProcesoComponent', () => {
  let component: ModalGuardarProcesoComponent;
  let fixture: ComponentFixture<ModalGuardarProcesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGuardarProcesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGuardarProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
