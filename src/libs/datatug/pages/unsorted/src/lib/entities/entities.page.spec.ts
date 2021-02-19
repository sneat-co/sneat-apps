import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {EntitiesPage} from './entities.page';

describe('EntitiesPage', () => {
	let component: EntitiesPage;
	let fixture: ComponentFixture<EntitiesPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [EntitiesPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(EntitiesPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
