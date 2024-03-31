import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';


export abstract class DialogBaseService<T> {


  protected dialog: MatDialog = inject(MatDialog)
  protected config:MatDialogConfig = {
    disableClose: true,
  }
  protected dialogRef!: MatDialogRef<T, unknown>;

  closeModal() {
    this.dialogRef.close();
  }
}
