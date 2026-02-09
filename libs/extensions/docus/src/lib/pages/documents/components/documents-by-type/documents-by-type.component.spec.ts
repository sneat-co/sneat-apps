import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { AssetService } from '@sneat/ext-assetus-components';
import { ClassName } from '@sneat/ui';

import { DocumentsByTypeComponent } from './documents-by-type.component';

describe('DocumentsByTypeComponent', () => {
	let component: DocumentsByTypeComponent;
	let fixture: ComponentFixture<DocumentsByTypeComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [DocumentsByTypeComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: ClassName, useValue: 'DocumentsByTypeComponent' },
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{ provide: AssetService, useValue: {} },
			],
		})
			.overrideComponent(DocumentsByTypeComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(DocumentsByTypeComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
