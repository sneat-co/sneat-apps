import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth-core';

import { ScrumsComponent } from './scrums.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { environment } from '../../../../environments/environment';
import { RouterTestingModule } from '@angular/router/testing';

describe('ScrumsComponent', () => {
	let component: ScrumsComponent;
	let fixture: ComponentFixture<ScrumsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ScrumsComponent,
				IonicModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [SneatUserService],
		}).compileComponents();

		fixture = TestBed.createComponent(ScrumsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
