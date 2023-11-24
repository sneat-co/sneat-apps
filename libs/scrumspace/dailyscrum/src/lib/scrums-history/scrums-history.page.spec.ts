import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScrumsHistoryPageComponent } from './scrums-history.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TeamService } from '../../services/team.service';
import { UserService } from '../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ScrumsHistoryPage', () => {
	let component: ScrumsHistoryPageComponent;
	let fixture: ComponentFixture<ScrumsHistoryPageComponent>;

	beforeEach(waitForAsync(async () => {
		TestBed.configureTestingModule({
			declarations: [ScrumsHistoryPageComponent],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
			],
			providers: [TeamService, UserService],
		}).compileComponents();
		fixture = TestBed.createComponent(ScrumsHistoryPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
