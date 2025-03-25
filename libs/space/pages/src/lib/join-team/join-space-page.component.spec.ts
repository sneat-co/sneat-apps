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
			declarations: [JoinSpacePageComponent],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
				// AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			// providers: [TeamService, UserService],
		}).compileComponents();

		fixture = TestBed.createComponent(JoinSpacePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
