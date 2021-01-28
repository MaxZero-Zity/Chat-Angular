import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Max2Component } from './max2.component';

describe('Max2Component', () => {
  let component: Max2Component;
  let fixture: ComponentFixture<Max2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Max2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Max2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
