import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxUserComponent } from './chat-box-user.component';

describe('ChatBoxUserComponent', () => {
  let component: ChatBoxUserComponent;
  let fixture: ComponentFixture<ChatBoxUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBoxUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
