import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowEspComponent } from './window-esp.component';

describe('WindowEspComponent', () => {
  let component: WindowEspComponent;
  let fixture: ComponentFixture<WindowEspComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowEspComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowEspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
