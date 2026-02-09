import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetAddDwellingComponent } from './asset-add-dwelling.component';
import { provideAssetusMocks } from '../../testing/test-utils';

describe('AssetAddDwellingPage', () => {
	let component: AssetAddDwellingComponent;
	let fixture: ComponentFixture<AssetAddDwellingComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [AssetAddDwellingComponent],
			providers: [...provideAssetusMocks()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(AssetAddDwellingComponent, {
				set: { imports: [], providers: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetAddDwellingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
