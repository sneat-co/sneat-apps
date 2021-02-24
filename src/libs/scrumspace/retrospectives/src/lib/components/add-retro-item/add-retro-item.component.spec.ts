import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AddRetroItemComponent} from './add-retro-item.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../environments/environment';

describe('AddRetroItemComponent', () => {
	let component: AddRetroItemComponent;
	let fixture: ComponentFixture<AddRetroItemComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [AddRetroItemComponent],
			imports: [
				IonicModule.forRoot(),
				HttpClientTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			]
		}).compileComponents();

		fixture = TestBed.createComponent(AddRetroItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
