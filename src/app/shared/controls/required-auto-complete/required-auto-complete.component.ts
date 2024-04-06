import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RequiredAutoComplete } from '@models/custom/requiredAutoCompelte';
@Component({
  selector: 'app-required-auto-complete',
  standalone: true,
  imports: [MatAutocompleteModule, MatInputModule, MatFormFieldModule],
  templateUrl: './required-auto-complete.component.html',
  styleUrl: './required-auto-complete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RequiredAutoCompleteComponent),
      multi: true
    }
  ]
})
export class RequiredAutoCompleteComponent implements ControlValueAccessor {
  data = input.required<Array<RequiredAutoComplete>>();
  label = input<string>('');
  placeholder = input<string>('');
  value: string = '';
  isDisabled!: boolean;

  onChange = (_: any) => { }
  onTouch = () => { }

  writeValue(value: string): void {
    console.log(value)
      this.value = '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(value: MatAutocompleteSelectedEvent) {
    this.value = value.option.value;
    this.onTouch();
    this.onChange(this.value);
  }

}
