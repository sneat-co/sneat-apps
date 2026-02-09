import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ContactService } from '@sneat/contactus-services';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';
import { provideLogistMocks } from '../../testing/test-utils';
import { LogistOrderService, LogistSpaceService } from '../../services';
import { NewLogistOrderPageComponent } from './new-logist-order-page.component';

vi.mock('@angular/fire/firestore');

describe('NewLogistOrderPageComponent', () => {
	let component: NewLogistOrderPageComponent;
	let fixture: ComponentFixture<NewLogistOrderPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [NewLogistOrderPageComponent],
			providers: [
				...provideLogistMocks(),
				LogistOrderService,
				LogistSpaceService,
				{
					provide: ContactService,
					useValue: {
						watchContactById: vi.fn(() => of({})),
					},
				},
				{
					provide: SneatApiService,
					useValue: {
						post: vi.fn(() => of({})),
						get: vi.fn(() => of({})),
						delete: vi.fn(() => of({})),
					},
				},
				{
					provide: Firestore,
					useValue: { type: 'Firestore', toJSON: () => ({}) },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(NewLogistOrderPageComponent, {
				set: {
					imports: [],
					providers: [],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(NewLogistOrderPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
