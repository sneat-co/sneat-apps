import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {EntityEditPage} from './entity-edit.page';

describe('EntityEditPage', () => {
	let component: EntityEditPage;
	let fixture: ComponentFixture<EntityEditPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [EntityEditPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(EntityEditPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
