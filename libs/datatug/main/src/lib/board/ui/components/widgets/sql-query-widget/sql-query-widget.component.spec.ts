import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SqlQueryWidgetComponent } from './sql-query-widget.component';

describe('SqlQueryWidgetComponent', () => {
	let component: SqlQueryWidgetComponent;
	let fixture: ComponentFixture<SqlQueryWidgetComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			,
			imports: [SqlQueryWidgetComponent, IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(SqlQueryWidgetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
