import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
} from '@ionic/angular/standalone';
import { createSetFocusToInput } from '@sneat/ui';
import { excludeEmpty } from '@sneat/core';
import { IPersonNames, isNameEmpty } from '@sneat/auth-models';
import { ErrorLogger } from '@sneat/core';
import { IFormField } from '@sneat/core';

export interface INamesFormFields {
  readonly firstName?: IFormField;
  readonly middleName?: IFormField;
  readonly lastName?: IFormField;
  readonly nickName?: IFormField;
  readonly fullName?: IFormField;
}

const maxNameLenValidator = Validators.maxLength(50);

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    IonItemDivider,
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
    IonIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-names-form',
  templateUrl: './names-form.component.html',
})
export class NamesFormComponent implements OnChanges, AfterViewInit {
  @Input() showHeader = true;
  @Input({ required: true }) name?: IPersonNames = {};
  @Input() isActive = true;
  @Input() disabled = false;
  @Input() fields?: INamesFormFields;
  @Input() showNextButton = false;

  @ViewChild('firstNameInput', { static: true }) firstNameInput?: IonInput;
  @ViewChild('lastNameInput', { static: true }) lastNameInput?: IonInput;
  @ViewChild('middleNameInput', { static: true }) middleNameInput?: IonInput;
  @ViewChild('fullNameInput', { static: true }) fullNameInput?: IonInput;
  @ViewChild('nickNameInput', { static: true }) nickNameInput?: IonInput;

  // @ViewChild('nextButton', {static: false}) nextButton?: IonButton;

  @Output() readonly keyupEnter = new EventEmitter<Event>();
  @Output() readonly namesChanged = new EventEmitter<IPersonNames>();

  @Output() readonly next = new EventEmitter<Event>();

  private initialNameChanged = true;
  private isFullNameChanged = false;
  private isViewInitiated = false;

  private inputToFocus?: IonInput;

  private readonly errorLogger = inject(ErrorLogger);

  public readonly fullName = new FormControl<string>('', [
    // Validators.required, -- not required if user entered only first name for example. In future may require to be an option
    maxNameLenValidator,
  ]);

  public readonly firstName = new FormControl<string>('', [
    maxNameLenValidator,
  ]);

  public readonly middleName = new FormControl<string>('', [
    maxNameLenValidator,
  ]);

  public readonly lastName = new FormControl<string>('', [maxNameLenValidator]);

  public readonly nickName = new FormControl<string>('', [maxNameLenValidator]);

  readonly isNamesFormValid = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const formGroup = control as UntypedFormGroup;
    const mustHave = function (name: string): string {
      const c = formGroup.controls[name];
      if (!c) {
        throw new Error(`form is missing control: "${name}"`);
      }
      return (c.value as string).trim();
    };
    const firstName = mustHave('firstName');
    const lastName = mustHave('lastName');
    const fullName = mustHave('fullName');
    const nickName = mustHave('nickName');

    const visibleNameFields: string[] = [
      ...(this.fields?.firstName?.hide ? [] : ['first name']),
      ...(this.fields?.lastName?.hide ? [] : ['last name']),
      ...(this.fields?.nickName?.hide ? [] : ['nickname']),
    ];

    if (!firstName && !lastName && !fullName && !nickName) {
      return {
        fullName:
          'If full name is empty at least one of the following must be provided: ' +
          visibleNameFields.join(', '),
      };
    }
    if (firstName && lastName && !fullName) {
      return {
        fullName:
          'If first & last names are supplied the full name should be supplied as well',
      };
    }
    return null;
  };

  public readonly namesForm = new FormGroup(
    {
      fullName: this.fullName,
      firstName: this.firstName,
      lastName: this.lastName,
      middleName: this.middleName,
      nickName: this.nickName,
    },
    this.isNamesFormValid,
  );

  // public get hasNames(): boolean {
  // 	return !!(
  // 		this.firstName.value ||
  // 		this.lastName.value ||
  // 		this.fullName.value ||
  // 		this.nickName.value
  // 	);
  // }

  private setFocusToInput(input: IonInput, delay = 333): void {
    const setFocusTo = createSetFocusToInput(this.errorLogger);
    setFocusTo(input, delay);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields']) {
      this.onInputChangeFields();
    }
    if (changes['name']) {
      this.onInputChangeName();
    }
    if (changes['disabled']) {
      this.onInputChangeDisabled();
    }
  }

  private onInputChangeDisabled(): void {
    if (this.disabled) {
      this.namesForm.disable();
    } else {
      this.namesForm.enable();
    }
  }

  private onInputChangeName(): void {
    const name = this.name;
    if (name) {
      if (name.firstName) {
        this.firstName.setValue(name.firstName);
      }
      if (name.lastName) {
        this.lastName.setValue(name.lastName);
      }
      if (name.middleName) {
        this.middleName.setValue(name.middleName);
      }
      if (name.nickName) {
        this.nickName.setValue(name.nickName);
      }
      if (name.fullName) {
        this.fullName.setValue(name.fullName);
      }
    }
    if (this.initialNameChanged) {
      this.initialNameChanged = false;
      if (!this.firstName.value) {
        this.inputToFocus = this.firstNameInput;
      } else if (!this.lastName.value) {
        this.inputToFocus = this.lastNameInput;
      } else if (!this.middleName.value) {
        this.inputToFocus = this.middleNameInput;
      } else if (!this.fullName.value) {
        this.inputToFocus = this.fullNameInput;
      }
      if (this.isViewInitiated && this.inputToFocus) {
        this.setFocusToInput(this.inputToFocus);
      }
    }
  }

  private onInputChangeFields(): void {
    const setValidators = (
      fc?: FormControl<string | null>,
      ff?: IFormField,
    ) => {
      if (!fc) {
        return;
      }
      fc.clearValidators();
      const validators = [maxNameLenValidator];
      if (ff?.required) {
        validators.push(Validators.required);
      }
      fc.addValidators(validators);
    };
    setValidators(this.firstName, this.fields?.firstName);
    setValidators(this.lastName, this.fields?.lastName);
    setValidators(this.nickName, this.fields?.nickName);
    setValidators(this.middleName, this.fields?.middleName);
    setValidators(this.fullName, this.fields?.fullName);
  }

  ngAfterViewInit(): void /* intentionally not ngOnInit */ {
    this.isViewInitiated = true;
    if (this.inputToFocus) {
      this.setFocusToInput(this.inputToFocus);
    }
  }

  onNameChanged(_event?: Event): void {
    // 'onNameChanged()',
    // this.isFullNameChanged,
    // this.firstName.value,
    // this.lastName.value,
    // event,
    if (!this.isFullNameChanged) {
      const fullName = this.generateFullName();

      if (fullName !== this.fullName.value) {
        this.fullName.setValue(fullName, {
          onlySelf: true,
          emitEvent: false,
          emitModelToViewChange: true,
          emitViewToModelChange: false,
        });
      }
    }
    this.setName();
  }

  private setName(): void {
    this.name = excludeEmpty({
      firstName: this.firstName.value || '',
      lastName: this.lastName.value || '',
      middleName: this.middleName.value || '',
      fullName: this.fullName.value || '',
      nickName: this.nickName.value || '',
    });
    if (this.isFullNameChanged && isNameEmpty(this.name)) {
      this.isFullNameChanged = false;
    }
    this.namesChanged.emit(this.name);
  }

  public names(): IPersonNames {
    return excludeEmpty({
      firstName: this.firstName.value || '',
      lastName: this.lastName.value || '',
      middleName: this.lastName.value || '',
      fullName: this.fullName.value || '',
    });
  }

  private generateFullName(): string {
    const first = (this.firstName.value || '').trim(),
      middle = (this.middleName.value || '').trim(),
      last = (this.lastName.value || '').trim();
    if ((first && last) || (first && middle) || (middle && last)) {
      return (first + ' ' + middle + ' ' + last).replace('  ', ' ').trim();
    }
    return '';
  }

  protected onFullNameChanged(_event?: Event): void {
    // 'onFullNameChanged()',
    // this.firstName.value,
    // this.lastName.value,
    // event,
    if (this.isFullNameChanged) {
      this.setName();
    } else {
      const fullName = this.generateFullName();
      if (this.fullName.value?.trim() !== fullName) {
        this.isFullNameChanged = true;
      }
    }
  }

  protected nameKeyupEnter(event: Event): void {
    if (this.namesForm?.valid) {
      this.keyupEnter.emit(event);
    }
    if (this.canGoNext) {
      this.next.emit(event);
    }
  }

  protected get canGoNext(): boolean {
    return !isNameEmpty(this.name);
  }

  protected onNext(event: Event): void {
    this.next.emit(event);
  }
}
