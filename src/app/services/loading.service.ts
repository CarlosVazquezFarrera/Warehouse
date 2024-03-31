import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from '../modals/loading/loading.component';
import { DialogBaseService } from './dialog-base.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingService extends DialogBaseService<LoadingComponent> {
  showLoadingScreen() {
    this.dialogRef = this.dialog.open(LoadingComponent, this.config)
  }

}
