import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MakeModelEngineComponent} from './make-model-engine.component';

describe('MakeModelEngineComponent', () => {
	let component: MakeModelEngineComponent;
	let fixture: ComponentFixture<MakeModelEngineComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MakeModelEngineComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MakeModelEngineComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
