import { TestBed } from '@angular/core/testing';

import { ProcesoService } from './proceso.service';

describe('ProcesoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcesoService = TestBed.get(ProcesoService);
    expect(service).toBeTruthy();
  });
});
