import { TestBed } from '@angular/core/testing';

import { ProductFormatService } from './product-format.service';

describe('ProductFormatService', () => {
  let service: ProductFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
