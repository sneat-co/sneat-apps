import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ProjectPage} from './project.page';

describe('ProjectPage', () => {
	let component: ProjectPage;
	let fixture: ComponentFixture<ProjectPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ProjectPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(ProjectPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
