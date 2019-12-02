import { TestBed } from '@angular/core/testing';

import { GerenciaService } from './gerencia.service';

describe('GerenciaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GerenciaService = TestBed.get(GerenciaService);
    expect(service).toBeTruthy();
  });
});
