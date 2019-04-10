import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchionComponent } from './archion.component';

describe('ArchionComponent', () => {
  let component: ArchionComponent;
  let fixture: ComponentFixture<ArchionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
