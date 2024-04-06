import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredAutoCompleteComponent } from './required-auto-complete.component';

describe('RequiredAutoCompleteComponent', () => {
  let component: RequiredAutoCompleteComponent;
  let fixture: ComponentFixture<RequiredAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredAutoCompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequiredAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
