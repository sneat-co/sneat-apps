import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MembersComponent } from './members.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { TeamService } from "@sneat/space-services";

describe('MembersComponent', () => {
	let component: MembersComponent;
	let fixture: ComponentFixture<MembersComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [MembersComponent],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
				// AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			// providers: [TeamService, UserService],
		}).compileComponents();

		fixture = TestBed.createComponent(MembersComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
