import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CintillaProcesoComponent } from './cintilla-proceso.component';

describe('CintillaProcesoComponent', () => {
  let component: CintillaProcesoComponent;
  let fixture: ComponentFixture<CintillaProcesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CintillaProcesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CintillaProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
