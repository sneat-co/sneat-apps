import { TestBed } from '@angular/core/testing';

import { Coordinator } from './coordinator';
import { HttpExecutor } from './executors/http-executor';
import { AgentService } from '../services/repo/agent.service';

describe('Coordinator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Coordinator,
        {
          provide: HttpExecutor,
          useValue: { execute: vi.fn() },
        },
        {
          provide: AgentService,
          useValue: { execute: vi.fn() },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(Coordinator)).toBeTruthy();
  });
});
