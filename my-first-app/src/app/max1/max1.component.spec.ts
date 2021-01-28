import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Max1Component } from './max1.component';

describe('Max1Component', () => {
  let component: Max1Component;
  let fixture: ComponentFixture<Max1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Max1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Max1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
