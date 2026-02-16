import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { DialogHeaderComponent } from './dialog-header.component';

describe('DialogHeaderComponent', () => {
  let component: DialogHeaderComponent;
  let fixture: ComponentFixture<DialogHeaderComponent>;
  let modalController: { dismiss: ReturnType<typeof vi.fn> };

  beforeEach(waitForAsync(async () => {
    modalController = {
      dismiss: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [DialogHeaderComponent],
      providers: [{ provide: ModalController, useValue: modalController }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(DialogHeaderComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
      })
      .compileComponents();
    fixture = TestBed.createComponent(DialogHeaderComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default dialogTitle', () => {
    expect(component.dialogTitle).toBe('Dialog');
  });

  it('should call modalController.dismiss when close is called', () => {
    const mockEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as Event;

    component.close(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(modalController.dismiss).toHaveBeenCalled();
  });

  it('should handle dismiss error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    modalController.dismiss = vi.fn().mockRejectedValue(new Error('Dismiss failed'));

    const mockEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as Event;

    component.close(mockEvent);

    // Wait for promise to reject
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});
