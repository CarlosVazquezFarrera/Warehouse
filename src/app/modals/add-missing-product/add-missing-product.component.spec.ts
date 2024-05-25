import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMissingProductComponent } from './add-missing-product.component';

describe('AddMissingProductComponent', () => {
  let component: AddMissingProductComponent;
  let fixture: ComponentFixture<AddMissingProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMissingProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMissingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
