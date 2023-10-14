import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth-core';

import { MembersListComponent } from './members-list.component';
import { RouterTestingModule } from '@angular/router/testing';
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
				providers: [SneatUserService, TeamService],
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
