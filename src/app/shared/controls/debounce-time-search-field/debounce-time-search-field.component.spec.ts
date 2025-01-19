import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebounceTimeSearchFieldComponent } from './debounce-time-search-field.component';

describe('DebounceTimeSearchFieldComponent', () => {
  let component: DebounceTimeSearchFieldComponent;
  let fixture: ComponentFixture<DebounceTimeSearchFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebounceTimeSearchFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DebounceTimeSearchFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
