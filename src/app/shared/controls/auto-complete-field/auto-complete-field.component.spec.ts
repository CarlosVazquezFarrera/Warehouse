import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteFieldComponent } from './auto-complete-field.component';

describe('AutoCompleteFieldComponent', () => {
  let component: AutoCompleteFieldComponent;
  let fixture: ComponentFixture<AutoCompleteFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoCompleteFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutoCompleteFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
