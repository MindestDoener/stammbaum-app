import { TestBed } from '@angular/core/testing';

import { FamilyTreeService } from './family-tree.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('FamilyTreeService', () => {
  let service: FamilyTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: HttpClientTestingModule },
        { provide: Router, useValue: RouterTestingModule },
      ]
    });
    service = TestBed.inject(FamilyTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
