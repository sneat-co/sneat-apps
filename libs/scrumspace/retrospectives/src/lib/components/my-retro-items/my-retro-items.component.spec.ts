import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ErrorLogger } from '@sneat/core';
import { SneatUserService } from '@sneat/auth-core';
import { RetrospectiveService } from '../../retrospective.service';
import { of } from 'rxjs';

import { MyRetroItemsComponent } from './my-retro-items.component';

describe('MyRetroItemsComponent', () => {
	let component: MyRetroItemsComponent;
	let fixture: ComponentFixture<MyRetroItemsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MyRetroItemsComponent, IonicModule.forRoot()],
			providers: [
				{
					provide: RetrospectiveService,
					useValue: { addRetroItem: vi.fn(), deleteRetroItem: vi.fn() },
				},
				{ provide: ErrorLogger, useValue: { logError: vi.fn() } },
				{
					provide: SneatUserService,
					useValue: {
						userState: of(null),
						userChanged: of(undefined),
						currentUserID: undefined,
					},
				},
			],
		})
			.overrideComponent(MyRetroItemsComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(MyRetroItemsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
