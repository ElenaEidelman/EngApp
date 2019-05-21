import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowLotInfoComponent } from '../info/window-lot-info.component';

describe('WindowLotInfoComponent', () => {
  let component: WindowLotInfoComponent;
  let fixture: ComponentFixture<WindowLotInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowLotInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowLotInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
