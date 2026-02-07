import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MetricsComponent } from './metrics.component';
import { UserService } from '../../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpaceService } from '@sneat/space-services';

describe('MetricsComponent', () => {
	let component: MetricsComponent;
	let fixture: ComponentFixture<MetricsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MetricsComponent, 
				IonicModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule],
			providers: [SpaceService, UserService]}).compileComponents();

		fixture = TestBed.createComponent(MetricsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
