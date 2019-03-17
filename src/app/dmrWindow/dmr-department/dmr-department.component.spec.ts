import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmrDepartmentComponent } from './dmr-department.component';

describe('DmrDepartmentComponent', () => {
  let component: DmrDepartmentComponent;
  let fixture: ComponentFixture<DmrDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmrDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmrDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
