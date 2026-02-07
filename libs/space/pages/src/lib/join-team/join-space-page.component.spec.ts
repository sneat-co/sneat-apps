import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JoinSpacePageComponent } from './join-space-page.component';
import { RouterTestingModule } from '@angular/router/testing';
// import { environment } from '../../../environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JoinSpacePage', () => {
	let component: JoinSpacePageComponent;
	let fixture: ComponentFixture<JoinSpacePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [
				JoinSpacePageComponent,
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(JoinSpacePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
