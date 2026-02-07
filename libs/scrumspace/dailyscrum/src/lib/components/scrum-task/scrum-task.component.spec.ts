// import { UserService } from '../../../services/user-service';
// import { environment } from '../../../../environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScrumTaskComponent } from './scrum-task.component';

describe('ScrumTaskComponent', () => {
	let component: ScrumTaskComponent;
	let fixture: ComponentFixture<ScrumTaskComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ScrumTaskComponent,
				IonicModule.forRoot(),
				HttpClientTestingModule,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ScrumTaskComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
