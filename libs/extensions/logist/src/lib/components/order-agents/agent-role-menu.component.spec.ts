import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular/standalone';
import { ContactsSelectorService } from '@sneat/contactus-shared';
import { ErrorLogger } from '@sneat/core';
import { AgentRoleMenuComponent } from './order-agents.component';

describe('AgentRoleMenuComponent', () => {
  let component: AgentRoleMenuComponent;
  let fixture: ComponentFixture<AgentRoleMenuComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentRoleMenuComponent],
      providers: [
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: () => vi.fn(),
          },
        },
        {
          provide: PopoverController,
          useValue: {
            create: vi.fn(),
            dismiss: vi.fn(() => Promise.resolve()),
          },
        },
        {
          provide: ContactsSelectorService,
          useValue: {
            selectSingleInModal: vi.fn(() => Promise.resolve(null)),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(AgentRoleMenuComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AgentRoleMenuComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
