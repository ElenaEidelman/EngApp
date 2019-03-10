import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwrComponent } from './swr.component';

describe('SwrComponent', () => {
  let component: SwrComponent;
  let fixture: ComponentFixture<SwrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
