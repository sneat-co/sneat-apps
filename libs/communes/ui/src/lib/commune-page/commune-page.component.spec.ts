import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommunePageComponent } from './commune-page.component';

describe('CommunePageComponent', () => {
	let component: CommunePageComponent;
	let fixture: ComponentFixture<CommunePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [CommunePageComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CommunePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
