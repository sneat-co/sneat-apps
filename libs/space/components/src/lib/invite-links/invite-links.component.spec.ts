import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InviteLinksComponent } from './invite-links.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SneatUserService } from '@sneat/auth-core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InviteLinksComponent', () => {
	let component: InviteLinksComponent;
	let fixture: ComponentFixture<InviteLinksComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [InviteLinksComponent],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
				// AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [SneatUserService],
		}).compileComponents();

		fixture = TestBed.createComponent(InviteLinksComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
