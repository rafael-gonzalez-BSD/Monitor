import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrillaSistemaComponent } from './grilla-sistema.component';

describe('GrillaSistemaComponent', () => {
  let component: GrillaSistemaComponent;
  let fixture: ComponentFixture<GrillaSistemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrillaSistemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrillaSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
