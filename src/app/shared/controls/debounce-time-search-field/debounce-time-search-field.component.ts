import { Component, forwardRef, input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from '@environments/environment';
import { MaterialModule } from '@shared/modules/material.module';
import { debounceTime, skip, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-debounce-time-search-field',
  standalone: true,
  imports: [
    MaterialModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DebounceTimeSearchFieldComponent),
      multi: true,
    },
  ],
  templateUrl: './debounce-time-search-field.component.html',
  styleUrl: './debounce-time-search-field.component.scss'
})
export class DebounceTimeSearchFieldComponent implements ControlValueAccessor, OnDestroy {
  placeholder = input<string>('Type');
  debounce = input<number>(environment.defaultDebounceTime);

  private onDestroy$ = new Subject<void>();

  inputText = new FormControl<string>('');

  onChange: (value: string | null) => void = () => { };
  onTouched: () => void = () => { };

  constructor() {
    this.inputText.valueChanges
      .pipe(
        skip(1),
        debounceTime(this.debounce()),
        takeUntil(this.onDestroy$)
      ).subscribe((value) => this.onChange(value));
  }

  public writeValue(value: string, emitEvent: boolean = true): void {
    this.inputText.setValue(value, { emitEvent });
  }

  public registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    // Implementa si necesitas manejar el estado deshabilitado
  }

  public inputClicked(): void {
    this.onTouched();
  }

  public clearSearch(): void {
    this.onChange(null);
    this.writeValue('', false)
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

