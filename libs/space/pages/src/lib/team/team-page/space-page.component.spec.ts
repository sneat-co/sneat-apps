import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth-core';

import { SpacePageComponent } from './space-page.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SpaceService } from '@sneat/space-services';

describe('SpacePage', () => {
	let component: SpacePageComponent;
	let fixture: ComponentFixture<SpacePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [SpacePageComponent],
			imports: [IonicModule.forRoot()],
			providers: [provideHttpClientTesting(), SpaceService, SneatUserService],
		}).compileComponents();

		fixture = TestBed.createComponent(SpacePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
