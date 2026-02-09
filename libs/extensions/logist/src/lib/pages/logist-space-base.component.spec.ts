import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';
import { provideLogistMocks } from '../testing/test-utils';
import { LogistSpaceService } from '../services';
import { LogistSpaceBaseComponent } from './logist-space-base.component';

vi.mock('@angular/fire/firestore');

@Component({
	selector: 'sneat-test-logist-space-base',
	template: '',
	standalone: true,
})
class TestLogistSpaceBaseComponent extends LogistSpaceBaseComponent {
	constructor() {
		super(TestBed.inject(LogistSpaceService));
	}
}

describe('LogistSpaceBaseComponent', () => {
	let component: TestLogistSpaceBaseComponent;
	let fixture: ComponentFixture<TestLogistSpaceBaseComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [TestLogistSpaceBaseComponent],
			providers: [
				...provideLogistMocks(),
				LogistSpaceService,
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
		}).compileComponents();

		fixture = TestBed.createComponent(TestLogistSpaceBaseComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
