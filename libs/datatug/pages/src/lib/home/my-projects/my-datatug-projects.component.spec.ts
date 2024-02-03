import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyDatatugProjectsComponent } from './my-datatug-projects.component';

describe('MyProjectsComponent', () => {
	let component: MyDatatugProjectsComponent;
	let fixture: ComponentFixture<MyDatatugProjectsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [MyDatatugProjectsComponent],
			imports: [IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(MyDatatugProjectsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
