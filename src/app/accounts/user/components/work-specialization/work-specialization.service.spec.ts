import { TestBed } from '@angular/core/testing';

import { WorkSpecializationService } from './work-specialization.service';

describe('WorkSpecializationService', () => {
  let service: WorkSpecializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkSpecializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
