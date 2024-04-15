import { Injectable } from '@angular/core';
import { DialogBaseService } from './dialog-base.service';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MovementsComponent } from '../modals/movements/movements.component';
import { ComponentType } from '@angular/cdk/portal';
type Modals = 'movements';
type ModalesAllowed = MovementsComponent;
@Injectable({
  providedIn: 'root'
})
export class ModalsService extends DialogBaseService<unknown> {
  private modals: Array<MatDialogRef<ModalesAllowed>> = new Array<MatDialogRef<ModalesAllowed>>();


  public showLateralModal(): void {
    const optionsDialogs: MatDialogConfig = {
      ...this.config,
      position: {
        top: '0',
        right: '0',
      },
      panelClass: 'modal-lateral'
    }
    this.open(MovementsComponent, optionsDialogs);
  }

  private open(componente: ComponentType<ModalesAllowed>,config?: MatDialogConfig) {
    config ? config : this.config;
    const dialog = this.dialog.open(componente, config);
    this.modals.push(dialog);
  }

  public override closeModal(): void {
    const modal = this.modals.pop()!;
    modal.close();
  }
}
