import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRetroItemComponent } from './add-retro-item.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddRetroItemComponent', () => {
	let component: AddRetroItemComponent;
	let fixture: ComponentFixture<AddRetroItemComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [AddRetroItemComponent],
			imports: [IonicModule.forRoot(), HttpClientTestingModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AddRetroItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
