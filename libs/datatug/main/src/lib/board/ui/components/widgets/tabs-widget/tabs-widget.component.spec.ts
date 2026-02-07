import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabsWidgetComponent } from './tabs-widget.component';

describe('TabsWidgetComponent', () => {
	let component: TabsWidgetComponent;
	let fixture: ComponentFixture<TabsWidgetComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			,
			imports: [TabsWidgetComponent, IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(TabsWidgetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
