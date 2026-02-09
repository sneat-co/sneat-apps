import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular/standalone';
import { DateInputComponent } from './date-input.component';

describe('DateInputComponent', () => {
	let component: DateInputComponent;
	let fixture: ComponentFixture<DateInputComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [DateInputComponent],
			providers: [
				{ provide: PopoverController, useValue: { create: vi.fn() } },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(DateInputComponent, {
				set: {
					imports: [],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
					template: '',
				},
			})
			.compileComponents();
		fixture = TestBed.createComponent(DateInputComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
