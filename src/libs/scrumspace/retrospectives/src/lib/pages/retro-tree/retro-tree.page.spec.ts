import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetroTreePage } from './retro-tree.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TeamService } from '../../../services/team.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RetroTreePage', () => {
	let component: RetroTreePage;
	let fixture: ComponentFixture<RetroTreePage>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [RetroTreePage],
				imports: [
					RouterTestingModule,
					HttpClientTestingModule,
					IonicModule.forRoot(),
					AngularFireModule.initializeApp(environment.firebaseConfig),
				],
				providers: [TeamService, UserService],
			}).compileComponents();

			fixture = TestBed.createComponent(RetroTreePage);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
