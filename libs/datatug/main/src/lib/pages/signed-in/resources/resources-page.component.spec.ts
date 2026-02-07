import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResourcesPageComponent } from './resources-page.component';

describe('ResourcesPage', () => {
	let component: ResourcesPageComponent;
	let fixture: ComponentFixture<ResourcesPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ResourcesPageComponent, IonicModule.forRoot()]}).compileComponents();

		fixture = TestBed.createComponent(ResourcesPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
