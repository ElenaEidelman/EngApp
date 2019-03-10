import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmrComponent } from './dmr.component';

describe('DmrComponent', () => {
  let component: DmrComponent;
  let fixture: ComponentFixture<DmrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
