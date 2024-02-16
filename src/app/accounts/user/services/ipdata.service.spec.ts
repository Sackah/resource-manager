import { TestBed } from '@angular/core/testing';

import { IpdataService } from './ipdata.service';

describe('IpdataService', () => {
  let service: IpdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
