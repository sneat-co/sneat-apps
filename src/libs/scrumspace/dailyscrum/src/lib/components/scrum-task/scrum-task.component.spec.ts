import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScrumTaskComponent } from './scrum-task.component';
import { AngularFireModule } from '@angular/fire/compat';
import { UserService } from '../../../services/user-service';
import { environment } from '../../../../environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ScrumTaskComponent', () => {
	let component: ScrumTaskComponent;
	let fixture: ComponentFixture<ScrumTaskComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ScrumTaskComponent],
				imports: [
					IonicModule.forRoot(),
					HttpClientTestingModule,
					AngularFireModule.initializeApp(environment.firebaseConfig),
				],
				providers: [UserService],
			}).compileComponents();

			fixture = TestBed.createComponent(ScrumTaskComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
