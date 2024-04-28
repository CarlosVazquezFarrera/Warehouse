import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  constructor() { }

  private snack = inject(MatSnackBar);
  private config: MatSnackBarConfig = {
    duration: environment.snackDefaultDuration * 1000
  }

  public showAutoCloseMessage(message: string): void {
    this.snack.open(message, 'OK', this.config);
  }
}
