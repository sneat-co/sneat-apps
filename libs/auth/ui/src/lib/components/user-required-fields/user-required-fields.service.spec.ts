import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { UserRequiredFieldsService } from './user-required-fields.service';
import { UserRequiredFieldsModalComponent } from './user-required-fields-modal.component';

describe('UserRequiredFieldsService', () => {
  let service: UserRequiredFieldsService;
  let modalController: ModalController;
  let mockModal: {
    present: ReturnType<typeof vi.fn>;
    onDidDismiss: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Create a mock modal object
    mockModal = {
      present: vi.fn().mockResolvedValue(undefined),
      onDidDismiss: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        UserRequiredFieldsService,
        {
          provide: ModalController,
          useValue: {
            create: vi.fn().mockResolvedValue(mockModal),
          },
        },
      ],
    });

    service = TestBed.inject(UserRequiredFieldsService);
    modalController = TestBed.inject(ModalController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('open', () => {
    it('should create a modal with UserRequiredFieldsModalComponent', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({ data: true });

      // Act
      const resultPromise = service.open();

      // Assert
      expect(modalController.create).toHaveBeenCalledWith({
        component: UserRequiredFieldsModalComponent,
      });

      await resultPromise;
    });

    it('should present the modal after creation', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({ data: true });

      // Act
      await service.open();

      // Assert
      expect(mockModal.present).toHaveBeenCalledTimes(1);
    });

    it('should return a Promise that resolves when modal is dismissed', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({ data: true });

      // Act
      const resultPromise = service.open();

      // Assert - Just verify we can await it and it returns the expected value
      const result = await resultPromise;
      expect(result).toBe(true);
    });

    it('should resolve to true when dismissal value is truthy', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({ data: 'some value' });

      // Act
      const result = await service.open();

      // Assert
      expect(result).toBe(true);
    });

    it('should resolve to true when dismissal value.data is an object', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({ data: { key: 'value' } });

      // Act
      const result = await service.open();

      // Assert
      expect(result).toBe(true);
    });

    it('should resolve to true when dismissal value.data is a non-empty string', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({ data: 'success' });

      // Act
      const result = await service.open();

      // Assert
      expect(result).toBe(true);
    });

    it('should resolve to true when dismissal value.data is a number', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({ data: 1 });

      // Act
      const result = await service.open();

      // Assert
      expect(result).toBe(true);
    });

    it('should resolve to false when dismissal value is undefined', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue(undefined);

      // Act
      const result = await service.open();

      // Assert
      expect(result).toBe(false);
    });

    it('should resolve to false when dismissal value.data is null (object is still truthy)', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({ data: null });

      // Act
      const result = await service.open();

      // Assert - Object with data:null is still a truthy object
      expect(result).toBe(true);
    });

    it('should resolve to false when dismissal value.data is false (object is still truthy)', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({ data: false });

      // Act
      const result = await service.open();

      // Assert - Object with data:false is still a truthy object
      expect(result).toBe(true);
    });

    it('should resolve to false when dismissal value.data is an empty string (object is still truthy)', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({ data: '' });

      // Act
      const result = await service.open();

      // Assert - Object with data:'' is still a truthy object
      expect(result).toBe(true);
    });

    it('should resolve to false when dismissal value.data is zero (object is still truthy)', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({ data: 0 });

      // Act
      const result = await service.open();

      // Assert - Object with data:0 is still a truthy object
      expect(result).toBe(true);
    });

    it('should reject the Promise when modal dismissal fails', async () => {
      // Arrange
      const dismissError = new Error('Modal dismissal failed');
      mockModal.onDidDismiss.mockRejectedValue(dismissError);

      // Act & Assert
      await expect(service.open()).rejects.toThrow('Modal dismissal failed');
    });

    it('should reject the Promise when onDidDismiss throws an error', async () => {
      // Arrange
      const error = new Error('Unexpected error');
      mockModal.onDidDismiss.mockRejectedValue(error);

      // Act & Assert
      await expect(service.open()).rejects.toThrow(error);
    });

    it('should log the dismissal value when modal is dismissed', async () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, 'log');
      const dismissalValue = { data: 'test-value' };
      mockModal.onDidDismiss.mockResolvedValue(dismissalValue);

      // Act
      await service.open();

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        'UserRequiredFieldsService.open(): modal dismissed:',
        dismissalValue,
      );

      consoleSpy.mockRestore();
    });

    it('should handle multiple sequential open calls independently', async () => {
      // Arrange
      const mockModal1 = {
        present: vi.fn().mockResolvedValue(undefined),
        onDidDismiss: vi.fn().mockResolvedValue({ data: true }),
      };
      const mockModal2 = {
        present: vi.fn().mockResolvedValue(undefined),
        onDidDismiss: vi.fn().mockResolvedValue(null), // null is falsy
      };

      (modalController.create as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(mockModal1)
        .mockResolvedValueOnce(mockModal2);

      // Act
      const result1 = await service.open();
      const result2 = await service.open();

      // Assert
      expect(result1).toBe(true); // { data: true } is truthy
      expect(result2).toBe(false); // null is falsy
      expect(modalController.create).toHaveBeenCalledTimes(2);
      expect(mockModal1.present).toHaveBeenCalledTimes(1);
      expect(mockModal2.present).toHaveBeenCalledTimes(1);
    });

    it('should call onDidDismiss after present completes', async () => {
      // Arrange
      const callOrder: string[] = [];
      mockModal.present.mockImplementation(() => {
        callOrder.push('present');
        return Promise.resolve();
      });
      mockModal.onDidDismiss.mockImplementation(() => {
        callOrder.push('onDidDismiss');
        return Promise.resolve({ data: true });
      });

      // Act
      await service.open();

      // Assert
      expect(callOrder).toEqual(['present', 'onDidDismiss']);
    });

    it('should handle dismissal with role property', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({
        data: { success: true },
        role: 'confirm',
      });

      // Act
      const result = await service.open();

      // Assert
      expect(result).toBe(true);
    });

    it('should handle empty object as dismissal value', async () => {
      // Arrange
      mockModal.onDidDismiss.mockResolvedValue({});

      // Act
      const result = await service.open();

      // Assert
      expect(result).toBe(true); // Empty object is truthy
    });

    describe('edge cases', () => {
      it('should handle modal creation failure', async () => {
        // Arrange
        const createError = new Error('Failed to create modal');
        (modalController.create as ReturnType<typeof vi.fn>).mockRejectedValue(
          createError,
        );

        // Act & Assert
        await expect(service.open()).rejects.toThrow('Failed to create modal');
      });

      it('should handle modal present failure', async () => {
        // Arrange
        const presentError = new Error('Failed to present modal');
        mockModal.present.mockRejectedValue(presentError);

        // Act & Assert
        await expect(service.open()).rejects.toThrow('Failed to present modal');
      });

      it('should handle dismissal value with data property as array', async () => {
        // Arrange
        mockModal.onDidDismiss.mockResolvedValue({ data: [1, 2, 3] });

        // Act
        const result = await service.open();

        // Assert
        expect(result).toBe(true);
      });

      it('should handle dismissal value with data property as empty array', async () => {
        // Arrange
        mockModal.onDidDismiss.mockResolvedValue({ data: [] });

        // Act
        const result = await service.open();

        // Assert
        expect(result).toBe(true); // Empty array is truthy
      });

      it('should handle NaN as dismissal value', async () => {
        // Arrange
        mockModal.onDidDismiss.mockResolvedValue({ data: NaN });

        // Act
        const result = await service.open();

        // Assert - Object with data:NaN is still a truthy object (even though NaN itself is falsy)
        expect(result).toBe(true);
      });
    });
  });
});
