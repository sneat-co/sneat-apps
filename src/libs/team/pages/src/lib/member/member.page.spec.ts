import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MemberPageComponent } from './member.page';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeamService } from '@sneat/team/services';

describe('MemberPage', () => {
	let component: MemberPageComponent;
	let fixture: ComponentFixture<MemberPageComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [MemberPageComponent],
				imports: [
					IonicModule.forRoot(),
					RouterTestingModule,
					HttpClientTestingModule,
				],
				providers: [UserService, TeamService],
			}).compileComponents();

			fixture = TestBed.createComponent(MemberPageComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
