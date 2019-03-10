import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmrlistComponent } from './dmrlist.component';

describe('DmrlistComponent', () => {
  let component: DmrlistComponent;
  let fixture: ComponentFixture<DmrlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmrlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmrlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
