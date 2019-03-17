import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmrJetComponent } from './dmr-jet.component';

describe('DmrJetComponent', () => {
  let component: DmrJetComponent;
  let fixture: ComponentFixture<DmrJetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmrJetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmrJetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
