import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CalendarFilterService } from '../../../calendar-filter.service';
import { RecurringsTabComponent } from './recurrings-tab.component';

describe('RecurringsTabComponent', () => {
	let component: RecurringsTabComponent;
	let fixture: ComponentFixture<RecurringsTabComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [RecurringsTabComponent],
			providers: [CalendarFilterService],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(RecurringsTabComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
			})
			.compileComponents();
		fixture = TestBed.createComponent(RecurringsTabComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$recurrings', []);
		fixture.componentRef.setInput('$contactusSpace', undefined);
		fixture.componentRef.setInput('$allRecurrings', []);
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
