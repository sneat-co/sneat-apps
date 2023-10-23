import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScrumTasksComponent } from './scrum-tasks.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../../../services/user-service';
import { TeamService } from '@sneat/team-services';

describe('ScrumTasksComponent', () => {
	let component: ScrumTasksComponent;
	let fixture: ComponentFixture<ScrumTasksComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ScrumTasksComponent],
			imports: [IonicModule.forRoot(), HttpClientTestingModule],
			providers: [TeamService, UserService],
		}).compileComponents();

		fixture = TestBed.createComponent(ScrumTasksComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
