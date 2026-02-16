import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SneatSelectAllOnFocusDirective } from './sneat-select-all-on-focus.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <input id="directInput" sneatSelectAllOnFocus value="test" />
    <div id="container" sneatSelectAllOnFocus>
      <input id="nestedInput" value="nested test" />
    </div>
    <textarea id="directTextarea" sneatSelectAllOnFocus>textarea test</textarea>
    <div id="textareaContainer" sneatSelectAllOnFocus>
      <textarea id="nestedTextarea">nested textarea</textarea>
    </div>
  `,
  standalone: true,
  imports: [SneatSelectAllOnFocusDirective],
})
class TestHostComponent {}

describe('SneatSelectAllOnFocusDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should select text on focus of input element', () => {
    const inputEl = fixture.debugElement.query(By.css('#directInput'));
    const directive = inputEl.injector.get(SneatSelectAllOnFocusDirective);
    const input = inputEl.nativeElement as HTMLInputElement;
    input.setSelectionRange = vi.fn();

    directive.selectAll();

    expect(input.setSelectionRange).toHaveBeenCalledWith(0, input.value.length);
  });

  it('should select text on focus of container element', () => {
    const containerEl = fixture.debugElement.query(By.css('#container'));
    const directive = containerEl.injector.get(SneatSelectAllOnFocusDirective);
    const nestedInput = containerEl.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    nestedInput.setSelectionRange = vi.fn();

    directive.selectAll();

    expect(nestedInput.setSelectionRange).toHaveBeenCalledWith(
      0,
      nestedInput.value.length,
    );
  });

  it('should handle setSelectionRange failure and fallback to select()', () => {
    const inputEl = fixture.debugElement.query(By.css('#directInput'));
    const directive = inputEl.injector.get(SneatSelectAllOnFocusDirective);
    const input = inputEl.nativeElement as HTMLInputElement;
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    // Mock setSelectionRange to throw error
    input.setSelectionRange = vi.fn().mockImplementation(() => {
      throw new Error('setSelectionRange not supported');
    });
    input.select = vi.fn();

    directive.selectAll();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Element does not support setSelectionRange',
    );
    expect(input.select).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });

  it('should select text on focus of textarea element', () => {
    const textareaEl = fixture.debugElement.query(By.css('#directTextarea'));
    const directive = textareaEl.injector.get(SneatSelectAllOnFocusDirective);
    const textarea = textareaEl.nativeElement as HTMLTextAreaElement;
    textarea.setSelectionRange = vi.fn();

    directive.selectAll();

    expect(textarea.setSelectionRange).toHaveBeenCalledWith(
      0,
      textarea.value.length,
    );
  });

  it('should select text on focus of container with nested textarea', () => {
    const containerEl = fixture.debugElement.query(
      By.css('#textareaContainer'),
    );
    const directive = containerEl.injector.get(SneatSelectAllOnFocusDirective);
    const nestedTextarea = containerEl.nativeElement.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    nestedTextarea.setSelectionRange = vi.fn();

    directive.selectAll();

    expect(nestedTextarea.setSelectionRange).toHaveBeenCalledWith(
      0,
      nestedTextarea.value.length,
    );
  });

  it('should handle textarea when setSelectionRange fails', () => {
    const textareaEl = fixture.debugElement.query(By.css('#directTextarea'));
    const directive = textareaEl.injector.get(SneatSelectAllOnFocusDirective);
    const textarea = textareaEl.nativeElement as HTMLTextAreaElement;
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    // Mock setSelectionRange to throw error
    textarea.setSelectionRange = vi.fn().mockImplementation(() => {
      throw new Error('setSelectionRange not supported');
    });
    textarea.select = vi.fn();

    directive.selectAll();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Element does not support setSelectionRange',
    );
    expect(textarea.select).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });
});
