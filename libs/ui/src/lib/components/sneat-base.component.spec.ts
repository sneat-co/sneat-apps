import { SneatBaseComponent } from './sneat-base.component';

class TestComponent extends (SneatBaseComponent as any) {
	constructor(errorLogger: any, className: string) {
		super();
		this.errorLogger = errorLogger;
		this.className = className;
		this.destroyed = {
			next: vi.fn(),
			complete: vi.fn(),
			asObservable: () => ({ subscribe: vi.fn() }),
		};
		this.subs = { unsubscribe: vi.fn() };
	}

	public getDestroyed() {
		return this.destroyed;
	}

	public getSubs() {
		return this.subs;
	}

	public log(msg: string) {
		// override log to avoid console output
	}
}

describe('SneatBaseComponent', () => {
	let component: TestComponent;
	let errorLoggerMock: any;

	beforeEach(() => {
		errorLoggerMock = {
			logError: vi.fn(),
			logErrorHandler: vi.fn(),
		};
		// Use Object.create to bypass constructor that calls inject()
		component = Object.create(TestComponent.prototype);
		(component as any).errorLogger = errorLoggerMock;
		(component as any).className = 'TestComponent';
		(component as any).destroyed = {
			next: vi.fn(),
			complete: vi.fn(),
			asObservable: () => ({ subscribe: vi.fn() }),
		};
		(component as any).subs = { unsubscribe: vi.fn() };
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should emit on destroyed and unsubscribe when ngOnDestroy is called', () => {
		component.ngOnDestroy();
		expect((component as any).destroyed.next).toHaveBeenCalled();
		expect((component as any).subs.unsubscribe).toHaveBeenCalled();
	});
});
