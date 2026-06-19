import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ToastController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { AssetService, IAssetDocumentContext } from '@sneat/extension-assetus';
import { ISpaceContext } from '@sneat/space-models';
import { ClassName } from '@sneat/ui';
import { EMPTY, of, throwError } from 'rxjs';
import { DocumentsBaseComponent } from './documents-base.component';

// Minimal concrete subclass so the abstract base can be instantiated.
@Component({ template: '' })
class TestDocsComponent extends DocumentsBaseComponent {
  docsChangedCount = 0;
  protected onDocsChanged(): void {
    this.docsChangedCount++;
  }
}

describe('DocumentsBaseComponent (via TestDocsComponent)', () => {
  let component: TestDocsComponent;
  let removeAsset: ReturnType<typeof vi.fn>;
  let toastPresent: ReturnType<typeof vi.fn>;
  let slidingClose: ReturnType<typeof vi.fn>;

  const space = { id: 'space1' } as ISpaceContext;
  const doc = (id: string): IAssetDocumentContext =>
    ({ id, space }) as IAssetDocumentContext;

  beforeEach(waitForAsync(async () => {
    removeAsset = vi.fn(() => EMPTY);
    toastPresent = vi.fn(() => Promise.resolve());
    slidingClose = vi.fn(() => Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [TestDocsComponent],
      providers: [
        { provide: ClassName, useValue: 'TestDocsComponent' },
        { provide: AssetService, useValue: { removeAsset } },
        {
          provide: ToastController,
          useValue: {
            create: vi.fn(() => Promise.resolve({ present: toastPresent })),
          },
        },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
      ],
    }).compileComponents();

    component = TestBed.createComponent(TestDocsComponent).componentInstance;
    component.space = space;
  }));

  it('removeAsset is called with the spaceID + assetID on delete', () => {
    component.deleteDocument(doc('d1'), {
      close: slidingClose,
    } as never);
    expect(removeAsset).toHaveBeenCalledWith({
      spaceID: 'space1',
      assetID: 'd1',
    });
  });

  it('on successful delete removes the doc, closes the slider and notifies', async () => {
    removeAsset.mockReturnValue(of(undefined));
    component.allDocuments = [doc('d1'), doc('d2')];

    component.deleteDocument(doc('d1'), { close: slidingClose } as never);
    // Allow the async complete handler (toast + slider close) to run.
    await new Promise((resolve) => setTimeout(resolve));

    expect(toastPresent).toHaveBeenCalled();
    expect(slidingClose).toHaveBeenCalled();
    expect(component.allDocuments?.map((d) => d.id)).toEqual(['d2']);
    expect(component.docsChangedCount).toBe(1);
  });

  it('on delete error closes the slider and logs', () => {
    removeAsset.mockReturnValue(throwError(() => new Error('boom')));
    const logError = TestBed.inject(ErrorLogger).logError as ReturnType<
      typeof vi.fn
    >;
    component.deleteDocument(doc('d1'), { close: slidingClose } as never);
    expect(slidingClose).toHaveBeenCalled();
    expect(logError).toHaveBeenCalled();
  });

  it('uses an empty spaceID when no space is set', () => {
    component.space = undefined;
    component.deleteDocument(doc('d9'), { close: slidingClose } as never);
    expect(removeAsset).toHaveBeenCalledWith({ spaceID: '', assetID: 'd9' });
  });
});
