import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LogistSpaceRolesComponent } from './logist-space-roles.component';

describe('LogistSpaceRolesComponent', () => {
	let component: LogistSpaceRolesComponent;
	let fixture: ComponentFixture<LogistSpaceRolesComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [LogistSpaceRolesComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(LogistSpaceRolesComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(LogistSpaceRolesComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
