import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScrumTasksComponent } from './scrum-tasks.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../../../services/user-service';
import { SpaceService } from '@sneat/space-services';

describe('ScrumTasksComponent', () => {
	let component: ScrumTasksComponent;
	let fixture: ComponentFixture<ScrumTasksComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [ScrumTasksComponent],
			imports: [IonicModule.forRoot(), HttpClientTestingModule],
			providers: [SpaceService, UserService],
		}).compileComponents();

		fixture = TestBed.createComponent(ScrumTasksComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
