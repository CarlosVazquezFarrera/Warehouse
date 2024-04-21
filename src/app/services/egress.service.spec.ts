import { TestBed } from '@angular/core/testing';

import { EgressService } from './egress.service';

describe('EgressService', () => {
  let service: EgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
