import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isNotLoggenInGuard } from './is-not-loggen-in.guard';

describe('isNotLoggenInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isNotLoggenInGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
