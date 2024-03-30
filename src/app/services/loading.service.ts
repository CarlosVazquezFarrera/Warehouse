import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from '../modals/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { }
  private dialog: MatDialog = inject(MatDialog)
  private config:MatDialogConfig = {
    disableClose: true,
    panelClass: 'transparent'
  }

  private dialogRef!: MatDialogRef<LoadingComponent, unknown>;

  showLoadingScreen() {
    this.dialogRef = this.dialog.open(LoadingComponent, this.config)
  }

  hideLoadingScreen() {
    this.dialogRef.close();
  }
}
