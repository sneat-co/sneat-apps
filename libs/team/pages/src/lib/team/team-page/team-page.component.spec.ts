import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth-core';

import { TeamPageComponent } from './team-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeamService } from '@sneat/team-services';

describe('TeamPage', () => {
	let component: TeamPageComponent;
	let fixture: ComponentFixture<TeamPageComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [TeamPageComponent],
			imports: [
				IonicModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule,
				// AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [TeamService, SneatUserService],
		}).compileComponents();

		fixture = TestBed.createComponent(TeamPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
