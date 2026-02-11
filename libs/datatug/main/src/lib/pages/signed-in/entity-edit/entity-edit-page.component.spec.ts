import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { EntityEditPageComponent } from './entity-edit-page.component';
import { DatatugNavContextService } from '../../../services/nav/datatug-nav-context.service';
import { EntityService } from '../../../services/unsorted/entity.service';
import { DatatugNavService } from '../../../services/nav/datatug-nav.service';

describe('EntityEditPage', () => {
  let component: EntityEditPageComponent;
  let fixture: ComponentFixture<EntityEditPageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityEditPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({ get: () => null }),
            paramMap: of({ get: () => null }),
            snapshot: { paramMap: { get: () => null } },
          },
        },
        {
          provide: DatatugNavContextService,
          useValue: {
            currentProject: of(undefined),
            currentEnv: of(undefined),
          },
        },
        { provide: EntityService, useValue: { createEntity: vi.fn() } },
        { provide: DatatugNavService, useValue: { goEntity: vi.fn() } },
        { provide: PopoverController, useValue: { create: vi.fn() } },
      ],
    })
      .overrideComponent(EntityEditPageComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EntityEditPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
