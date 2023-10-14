import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MyRetroItemsComponent } from './my-retro-items.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeamService } from '../../../services/team.service';
import { UserService } from '../../../services/user-service';

describe('MyRetroItemsComponent', () => {
	let component: MyRetroItemsComponent;
	let fixture: ComponentFixture<MyRetroItemsComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [MyRetroItemsComponent],
			imports: [IonicModule.forRoot(), HttpClientTestingModule],
			providers: [TeamService, UserService],
		}).compileComponents();

		fixture = TestBed.createComponent(MyRetroItemsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
