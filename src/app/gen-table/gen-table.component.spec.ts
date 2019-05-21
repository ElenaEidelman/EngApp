import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenTableComponent } from './gen-table.component';

describe('GenTableComponent', () => {
  let component: GenTableComponent;
  let fixture: ComponentFixture<GenTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
