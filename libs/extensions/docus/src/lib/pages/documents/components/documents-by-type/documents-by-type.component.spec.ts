import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { AssetService } from '@sneat/extension-assetus';
import { ClassName } from '@sneat/ui';

import { DocumentsByTypeComponent } from './documents-by-type.component';

describe('DocumentsByTypeComponent', () => {
  let component: DocumentsByTypeComponent;
  let fixture: ComponentFixture<DocumentsByTypeComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsByTypeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClassName, useValue: 'DocumentsByTypeComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        { provide: AssetService, useValue: {} },
      ],
    })
      .overrideComponent(DocumentsByTypeComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DocumentsByTypeComponent);
    component = fixture.componentInstance;
  }));

  const c = () => component as unknown as Record<string, any>;
  const doc = (id: string, type?: string) =>
    ({ id, space: { id: 's1' }, dbo: { type } }) as never;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onDocsChanged groups documents by dbo.type, routing unknowns to other', () => {
    component.allDocuments = [
      doc('d1', 'passport'),
      doc('d2', 'passport'),
      doc('d3', 'unknown_type'),
    ];
    c()['onDocsChanged']();

    const passport = c()['docTypes'].find(
      (t: { id: string }) => t.id === 'passport',
    );
    const other = c()['docTypes'].find((t: { id: string }) => t.id === 'other');
    expect(passport.documents.map((d: { id: string }) => d.id)).toEqual([
      'd1',
      'd2',
    ]);
    expect(other.documents.map((d: { id: string }) => d.id)).toEqual(['d3']);
  });

  it('selectDocType creates a new doc when the type has no documents', () => {
    const emit = vi.spyOn(component.goNewDoc, 'emit');
    const passport = c()['docTypes'].find(
      (t: { id: string }) => t.id === 'passport',
    );
    passport.documents = [];
    component.selectDocType(passport);
    expect(emit).toHaveBeenCalledWith('passport');
  });

  it('selectDocType toggles expansion when the type already has documents', () => {
    const passport = c()['docTypes'].find(
      (t: { id: string }) => t.id === 'passport',
    );
    passport.documents = [doc('d1', 'passport')];
    passport.expanded = false;
    component.selectDocType(passport);
    expect(passport.expanded).toBe(true);
  });

  it('newDoc stops event propagation and emits the type id', () => {
    const emit = vi.spyOn(component.goNewDoc, 'emit');
    const event = { stopPropagation: vi.fn() } as unknown as Event;
    component.newDoc({ id: 'other', title: 'Other' } as never, event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(emit).toHaveBeenCalledWith('other');
  });
});
