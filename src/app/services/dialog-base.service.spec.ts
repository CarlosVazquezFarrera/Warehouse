import { TestBed } from '@angular/core/testing';

import { DialogBaseService } from './dialog-base.service';

describe('DialogBaseService', () => {
  let service: DialogBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
