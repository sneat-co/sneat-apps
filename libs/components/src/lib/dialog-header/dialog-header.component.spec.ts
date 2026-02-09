import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { DialogHeaderComponent } from './dialog-header.component';

describe('DialogHeaderComponent', () => {
	let component: DialogHeaderComponent;
	let fixture: ComponentFixture<DialogHeaderComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogHeaderComponent],
			providers: [{ provide: ModalController, useValue: { dismiss: vi.fn() } }],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(DialogHeaderComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();
		fixture = TestBed.createComponent(DialogHeaderComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
