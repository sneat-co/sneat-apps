import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpacesCardComponent } from './spaces-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpaceService } from '@sneat/space-services';

describe('SpacesCardComponent', () => {
	let component: SpacesCardComponent;
	let fixture: ComponentFixture<SpacesCardComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [SpacesCardComponent],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
			],
			providers: [SpaceService, UserService],
		}).compileComponents();

		fixture = TestBed.createComponent(SpacesCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
