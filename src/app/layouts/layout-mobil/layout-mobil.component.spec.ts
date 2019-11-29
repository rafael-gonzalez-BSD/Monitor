import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutMobilComponent } from './layout-mobil.component';

describe('LayoutMobilComponent', () => {
  let component: LayoutMobilComponent;
  let fixture: ComponentFixture<LayoutMobilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutMobilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutMobilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
