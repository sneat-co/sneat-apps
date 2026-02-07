import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnvDbPageComponent } from './env-db-page.component';

describe('EnvDbPage', () => {
	let component: EnvDbPageComponent;
	let fixture: ComponentFixture<EnvDbPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			,
			imports: [EnvDbPageComponent, IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(EnvDbPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
