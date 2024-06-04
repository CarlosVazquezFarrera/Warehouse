import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, Injector, OnChanges, OnInit, SimpleChanges, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Observable, map, startWith } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { JsonType } from '@shared/utils/error-message-handle';

export type typeField = 'text' | 'number'

@Component({
  selector: 'app-auto-complete-field',
  standalone: true,
  imports: [
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './auto-complete-field.component.html',
  styleUrl: './auto-complete-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteFieldComponent),
      multi: true
    }
  ]
})

export class AutoCompleteFieldComponent implements ControlValueAccessor, OnChanges, OnInit {
  constructor(private injector: Injector) {
  }


  data = input.required<Array<any>>();
  label = input.required<string>();

  placeholder = input<string>('Pick one');
  typeField = input<typeField>('number');
  idPropertyName = input('id');
  textPropertyName = input('name');
  suffixPropertyName = input('');
  textFilterProperty = input('');
  jsonDataError = input();

  inputText = new FormControl<string>('');
  ngControl!: NgControl;


  filteredOptions!: Observable<any[]>;

  private onChange = (value: string | null) => { };
  private onTouch = () => { };

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null)!;

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['data'].firstChange) return;
    this.filteredOptions = this.inputText.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value || ''))
    );

    const validators = this.ngControl.control?.validator;
    if (!validators) return;

    this.inputText.setValidators(validators);
    this.inputText.updateValueAndValidity();


  }

  public writeValue(data: string): void {
    this.inputText.setValue(data);
  }
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public setDisabledState?(isDisabled: boolean): void { }

  private filter(value: string): Array<any> {
    if (this.textFilterProperty() == '') throw new Error('textFilterProperty was not set.');
    const filterValue = value.toLowerCase();

    return this.data().filter((option) =>
      option[this.textFilterProperty()].toString().toLocaleLowerCase().includes(filterValue)
    );
  }

  public displayValueSelected(id: string): string {
    if (!id) return '';
    const text = this.getElementById(id);
    if (!text) return '';

    if (this.suffixPropertyName()) {
      return `${text[this.suffixPropertyName()]} - ${text[this.textPropertyName()]}`
    }
    return `${text[this.textPropertyName()]}`;
  }

  private getElementById(id: string): any {
    return this.data().find(data => data[this.idPropertyName()] === id);
  }

  public elementSelected(id: string): void {
    this.onChange(id);

  }

  public clearValue() {
    this.onChange(null);
    this.writeValue('')
  }

  public inputClicked(): void {
    this.onTouch();
  }

  public get errorMessages(): string {
    const controlErros = this.ngControl.errors;
    if (!controlErros) return '';
    const errors = Object.keys(controlErros as object);
    const error = errors[0];
    const jsonError = this.jsonDataError() as JsonType;
    if (!jsonError) return '';
    return jsonError[error];
  }

}