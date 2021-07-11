import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {SqlQueryEditorComponent} from './sql-query-editor.component';

describe('SqlEditorPage', () => {
	let component: SqlQueryEditorComponent;
	let fixture: ComponentFixture<SqlQueryEditorComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [SqlQueryEditorComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(SqlQueryEditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
