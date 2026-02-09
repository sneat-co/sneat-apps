import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ContactsSelectorService } from '@sneat/contactus-shared';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { LogistOrderService } from '../../services';
import { ContainerPointComponent } from './container-point.component';

vi.mock('@angular/fire/firestore');

describe('ContainerPointComponent', () => {
	let component: ContainerPointComponent;
	let fixture: ComponentFixture<ContainerPointComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ContainerPointComponent],
			providers: [
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: ContactsSelectorService,
					useValue: { selectSingleInModal: vi.fn(() => Promise.resolve(null)) },
				},
				LogistOrderService,
				{
					provide: SneatApiService,
					useValue: { post: vi.fn(() => of({})), delete: vi.fn(() => of({})) },
				},
				{
					provide: Firestore,
					useValue: { type: 'Firestore', toJSON: () => ({}) },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(ContainerPointComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(ContainerPointComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
