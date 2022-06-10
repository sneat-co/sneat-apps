import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnvSelectorComponent } from './env-selector.component';

describe('EnvSelectorComponent', () => {
	let component: EnvSelectorComponent;
	let fixture: ComponentFixture<EnvSelectorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EnvSelectorComponent],
			imports: [IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(EnvSelectorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
