import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFiltrosProcesoComponent } from './modal-filtros-proceso.component';

describe('ModalFiltrosProcesoComponent', () => {
  let component: ModalFiltrosProcesoComponent;
  let fixture: ComponentFixture<ModalFiltrosProcesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFiltrosProcesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFiltrosProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
