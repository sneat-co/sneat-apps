import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetrospectivesComponent } from './retrospectives.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RetrospectivesComponent', () => {
	let component: RetrospectivesComponent;
	let fixture: ComponentFixture<RetrospectivesComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [RetrospectivesComponent],
			imports: [
				IonicModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule,
				// AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			// providers: [TeamService, UserService],
		}).compileComponents();

		fixture = TestBed.createComponent(RetrospectivesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
