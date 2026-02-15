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
    const nestedInput = containerEl.nativeElement.querySelector('input') as HTMLInputElement;
    nestedInput.setSelectionRange = vi.fn();

    directive.selectAll();

    expect(nestedInput.setSelectionRange).toHaveBeenCalledWith(0, nestedInput.value.length);
  });
});
