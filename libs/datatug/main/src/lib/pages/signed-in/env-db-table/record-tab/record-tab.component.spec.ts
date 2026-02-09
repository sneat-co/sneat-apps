import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecordTabComponent } from './record-tab.component';

describe('RecordTabComponent', () => {
	let component: RecordTabComponent;
	let fixture: ComponentFixture<RecordTabComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [RecordTabComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(RecordTabComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(RecordTabComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
