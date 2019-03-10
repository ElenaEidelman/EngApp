import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmrsearchComponent } from './dmrsearch.component';

describe('DmrsearchComponent', () => {
  let component: DmrsearchComponent;
  let fixture: ComponentFixture<DmrsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmrsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmrsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
