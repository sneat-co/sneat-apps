import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';
import { provideLogistMocks } from '../../testing/test-utils';
import { LogistOrderService } from '../../services';
import { LogistOrdersPageComponent } from './logist-orders-page.component';

vi.mock('@angular/fire/firestore');

describe('LogistOrdersPageComponent', () => {
	let component: LogistOrdersPageComponent;
	let fixture: ComponentFixture<LogistOrdersPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [LogistOrdersPageComponent],
			providers: [
				...provideLogistMocks(),
				LogistOrderService,
				{
					provide: SneatApiService,
					useValue: {
						post: vi.fn(() => of({})),
						get: vi.fn(() => of({})),
					},
				},
				{
					provide: Firestore,
					useValue: { type: 'Firestore', toJSON: () => ({}) },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(LogistOrdersPageComponent, {
				set: {
					imports: [],
					providers: [],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(LogistOrdersPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
