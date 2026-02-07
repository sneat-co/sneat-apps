import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth-core';

import { MembersListComponent } from './members-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpaceService } from '@sneat/space-services';

describe('MembersListComponent', () => {
	let component: MembersListComponent;
	let fixture: ComponentFixture<MembersListComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			,
			imports: [MembersListComponent, 
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule],
			providers: [SneatUserService, SpaceService],
		}).compileComponents();

		fixture = TestBed.createComponent(MembersListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
