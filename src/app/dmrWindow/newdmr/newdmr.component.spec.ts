import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewdmrComponent } from './newdmr.component';

describe('NewdmrComponent', () => {
  let component: NewdmrComponent;
  let fixture: ComponentFixture<NewdmrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewdmrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewdmrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
