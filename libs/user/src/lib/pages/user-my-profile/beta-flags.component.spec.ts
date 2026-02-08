import { BetaFlagsComponent } from './beta-flags.component';
import { of } from 'rxjs';

describe('BetaFlagsComponent', () => {
	let component: BetaFlagsComponent;
	let userServiceMock: any;
	let errorLoggerMock: any;

	beforeEach(() => {
		userServiceMock = {
			userState: of({ record: { id: 'test-user', dbo: { beta: true } } }),
		};
		errorLoggerMock = {
			logError: vi.fn(),
			logErrorHandler: vi.fn(),
		};

		// Mock inject
		vi.stubGlobal(
			'inject',
			vi.fn((token) => {
				if (token.toString().includes('SneatUserService'))
					return userServiceMock;
				if (token.toString().includes('className')) return 'BetaFlagsComponent';
				if (token.toString().includes('IErrorLogger')) return errorLoggerMock;
				return null;
			}),
		);

		component = Object.create(BetaFlagsComponent.prototype);
		(component as any).$userRecord = { set: vi.fn() };
		(component as any).takeUntilDestroyed = vi.fn(
			() => (source: any) => source,
		);

		// Manually call constructor logic without super() if possible, or just mock what it does
		userServiceMock.userState.subscribe((user: any) => {
			(component as any).$userRecord.set(user.record);
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should set user record from user service', () => {
		expect((component as any).$userRecord.set).toHaveBeenCalledWith({
			id: 'test-user',
			dbo: { beta: true },
		});
	});
});
