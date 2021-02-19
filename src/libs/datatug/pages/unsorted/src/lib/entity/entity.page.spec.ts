import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {EntityPage} from './entity.page';

describe('EntityPage', () => {
	let component: EntityPage;
	let fixture: ComponentFixture<EntityPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [EntityPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(EntityPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
