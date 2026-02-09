import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SpacePageTitleComponent } from './space-page-title.component';

describe('SpacePageTitleComponent', () => {
	let component: SpacePageTitleComponent;
	let fixture: ComponentFixture<SpacePageTitleComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [SpacePageTitleComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(SpacePageTitleComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();
		fixture = TestBed.createComponent(SpacePageTitleComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
