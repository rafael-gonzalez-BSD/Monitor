import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarMovilComponent } from './navbar-movil.component';

describe('NavbarMovilComponent', () => {
  let component: NavbarMovilComponent;
  let fixture: ComponentFixture<NavbarMovilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarMovilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
