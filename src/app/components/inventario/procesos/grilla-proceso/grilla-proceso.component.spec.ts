import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrillaProcesoComponent } from './grilla-proceso.component';

describe('GrillaProcesoComponent', () => {
  let component: GrillaProcesoComponent;
  let fixture: ComponentFixture<GrillaProcesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrillaProcesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrillaProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
