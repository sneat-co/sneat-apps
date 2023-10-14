import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddMetricPageComponent } from './add-metric-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TeamService } from '../../services/team.service';
import { UserService } from '../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddMetricPage', () => {
	let component: AddMetricPageComponent;
	let fixture: ComponentFixture<AddMetricPageComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [AddMetricPageComponent],
				imports: [
					IonicModule.forRoot(),
					RouterTestingModule,
					HttpClientTestingModule,
				],
				providers: [TeamService, UserService],
			}).compileComponents();

			fixture = TestBed.createComponent(AddMetricPageComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
