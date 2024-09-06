import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAgentComponent } from './admin-agent.component';

describe('AdminAgentComponent', () => {
  let component: AdminAgentComponent;
  let fixture: ComponentFixture<AdminAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAgentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
