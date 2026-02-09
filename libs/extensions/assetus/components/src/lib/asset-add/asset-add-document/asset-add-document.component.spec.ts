import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetAddDocumentComponent } from './asset-add-document.component';
import { provideAssetusMocks } from '../../testing/test-utils';

describe('AssetAddDocumentComponent', () => {
	let component: AssetAddDocumentComponent;
	let fixture: ComponentFixture<AssetAddDocumentComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [AssetAddDocumentComponent],
			providers: [...provideAssetusMocks()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(AssetAddDocumentComponent, {
				set: { imports: [], providers: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetAddDocumentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
