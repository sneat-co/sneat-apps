import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { ListusComponentBaseParams } from '../../../listus-component-base-params';
import { ListDialogsService } from '../../dialogs/ListDialogs.service';

import { ListItemComponent } from './list-item.component';

describe('ListItemComponent', () => {
	let component: ListItemComponent;
	let fixture: ComponentFixture<ListItemComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ListItemComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ListusComponentBaseParams,
					useValue: {
						spaceParams: {
							errorLogger: {
								logError: vi.fn(),
								logErrorHandler: () => vi.fn(),
							},
							loggerFactory: { getLogger: () => console },
							userService: {
								userState: of(null),
								userChanged: of(undefined),
								currentUserID: undefined,
							},
							spaceNavService: {
								navigateForwardToSpacePage: vi.fn(),
							},
							preloader: {
								preload: vi.fn(),
								markAsPreloaded: vi.fn(),
							},
						},
						listService: {
							setListItemsIsCompleted: vi.fn(() => of(null)),
							deleteListItems: vi.fn(() => of(null)),
						},
					},
				},
				{
					provide: ListDialogsService,
					useValue: { copyListItems: vi.fn() },
				},
			],
		})
			.overrideComponent(ListItemComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(ListItemComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
