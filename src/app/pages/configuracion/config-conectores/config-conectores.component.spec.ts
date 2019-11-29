import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigConectoresComponent } from './config-conectores.component';

describe('ConfigConectoresComponent', () => {
  let component: ConfigConectoresComponent;
  let fixture: ComponentFixture<ConfigConectoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigConectoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigConectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
