import { TestBed } from '@angular/core/testing';

import { PrivilegeGuard } from './privilege.guard';

xdescribe('PrivilegeGuard', () => {
  let guard: PrivilegeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PrivilegeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
