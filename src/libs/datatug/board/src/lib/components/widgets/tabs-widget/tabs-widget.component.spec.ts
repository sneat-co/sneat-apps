import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabsWidgetComponent } from './tabs-widget.component';

describe('TabsWidgetComponent', () => {
	let component: TabsWidgetComponent;
	let fixture: ComponentFixture<TabsWidgetComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [TabsWidgetComponent],
				imports: [IonicModule.forRoot()],
			}).compileComponents();

			fixture = TestBed.createComponent(TabsWidgetComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
