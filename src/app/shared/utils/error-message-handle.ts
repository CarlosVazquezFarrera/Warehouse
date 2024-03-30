import { AbstractControl } from "@angular/forms";
import { distinctUntilChanged, merge } from "rxjs";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  WritableSignal } from "@angular/core";

class jsonType {
  [key: string]: string;
}
export function ErrorMessageHandle(control: AbstractControl, signal: WritableSignal<string>, jsonfile: jsonType) {
  merge(control.statusChanges, control.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => signal.set(createErrorMessage(control, jsonfile)));
}

function createErrorMessage(control: AbstractControl, json: jsonType): string {
  if (!control.errors) return '';

  const errors = Object.keys(control.errors as object);
  const error = errors[0];
  return json[error];
}
