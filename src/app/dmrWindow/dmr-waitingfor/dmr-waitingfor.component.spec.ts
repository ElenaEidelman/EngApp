import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmrWaitingforComponent } from './dmr-waitingfor.component';

describe('DmrWaitingforComponent', () => {
  let component: DmrWaitingforComponent;
  let fixture: ComponentFixture<DmrWaitingforComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmrWaitingforComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmrWaitingforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
