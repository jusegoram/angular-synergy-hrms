/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HrService } from './hr.service';

describe('Service: Hr', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HrService]
    });
  });

  it('should ...', inject([HrService], (service: HrService) => {
    expect(service).toBeTruthy();
  }));
});
