import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetroTreePageComponent } from './retro-tree-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TeamService } from '../../../services/team.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RetroTreePage', () => {
	let component: RetroTreePageComponent;
	let fixture: ComponentFixture<RetroTreePageComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [RetroTreePageComponent],
				imports: [
					RouterTestingModule,
					HttpClientTestingModule,
					IonicModule.forRoot(),
					AngularFireModule.initializeApp(environment.firebaseConfig),
				],
				providers: [TeamService, UserService],
			}).compileComponents();

			fixture = TestBed.createComponent(RetroTreePageComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
