import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth-core';

import { SpacePageComponent } from './space-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpaceService } from '@sneat/team-services';

describe('TeamPage', () => {
	let component: SpacePageComponent;
	let fixture: ComponentFixture<SpacePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [SpacePageComponent],
			imports: [
				IonicModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule,
				// AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [SpaceService, SneatUserService],
		}).compileComponents();

		fixture = TestBed.createComponent(SpacePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
