import { TestBed } from '@angular/core/testing';

import { EditAvailabilityService } from './edit-availability.service';

describe('EditAvailabilityService', () => {
  let service: EditAvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditAvailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
