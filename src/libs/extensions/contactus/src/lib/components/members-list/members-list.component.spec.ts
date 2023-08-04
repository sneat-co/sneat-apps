import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MembersListComponent } from './members-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeamService } from '@sneat/team/services';

describe('MembersListComponent', () => {
	let component: MembersListComponent;
	let fixture: ComponentFixture<MembersListComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [MembersListComponent],
				imports: [
					IonicModule.forRoot(),
					RouterTestingModule,
					HttpClientTestingModule,
				],
				providers: [UserService, TeamService],
			}).compileComponents();

			fixture = TestBed.createComponent(MembersListComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
