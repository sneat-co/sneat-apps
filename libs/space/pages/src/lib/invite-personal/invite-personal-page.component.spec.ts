import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvitePersonalPageComponent } from './invite-personal-page.component';
import { UserService } from '../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpaceService } from '@sneat/space-services';

describe('InvitePersonalPage', () => {
	let component: InvitePersonalPageComponent;
	let fixture: ComponentFixture<InvitePersonalPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [InvitePersonalPageComponent, 
				IonicModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule],
			providers: [UserService, SpaceService]}).compileComponents();

		fixture = TestBed.createComponent(InvitePersonalPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
