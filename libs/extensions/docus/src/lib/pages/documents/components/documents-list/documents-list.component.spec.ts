import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { AssetService } from '@sneat/extension-assetus';
import { ClassName } from '@sneat/ui';

import { DocumentsListComponent } from './documents-list.component';

describe('DocumentsListComponent', () => {
  let component: DocumentsListComponent;
  let fixture: ComponentFixture<DocumentsListComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClassName, useValue: 'DocumentsListComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        { provide: AssetService, useValue: {} },
      ],
    })
      .overrideComponent(DocumentsListComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DocumentsListComponent);
    component = fixture.componentInstance;
  }));

  const c = () => component as unknown as Record<string, any>;
  const doc = (id: string, name?: string, type?: string) =>
    ({ id, space: { id: 's1' }, dbo: { name, type } }) as never;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onDocsChanged keeps all documents when there is no filter', () => {
    component.allDocuments = [doc('d1', 'Passport'), doc('d2', 'Visa')];
    c()['filter'] = '';
    c()['onDocsChanged']();
    expect(c()['filteredDocs'].map((d: { id: string }) => d.id)).toEqual([
      'd1',
      'd2',
    ]);
  });

  it('onDocsChanged filters by dbo name and dbo type', () => {
    component.allDocuments = [
      doc('d1', 'Passport', 'passport'),
      doc('d2', 'Visa', 'other'),
    ];
    c()['filter'] = 'pass';
    c()['onDocsChanged']();
    expect(c()['filteredDocs'].map((d: { id: string }) => d.id)).toEqual([
      'd1',
    ]);

    c()['filter'] = 'other';
    c()['onDocsChanged']();
    expect(c()['filteredDocs'].map((d: { id: string }) => d.id)).toEqual([
      'd2',
    ]);
  });
});
