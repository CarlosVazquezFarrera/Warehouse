import { Injectable } from '@angular/core';
import { DialogBaseService } from './dialog-base.service';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { MovementsComponent } from '@modals/movements/movements.component';
import { QrScannerComponent } from '@modals/qr-scanner/qr-scanner.component';
import { AddSupplyComponent } from '@modals/add-supply/add-supply.component';
type LateralModals = 'movements';
type Modals = 'qrScanner' | 'addSupply';
type AllowedModals = MovementsComponent | QrScannerComponent | AddSupplyComponent;
@Injectable({
  providedIn: 'root'
})
export class ModalsService extends DialogBaseService<AllowedModals> {
  private modals: Array<MatDialogRef<AllowedModals>> = new Array<MatDialogRef<AllowedModals>>();


  public showLateralModal(modal: LateralModals): void {
    const optionsDialogs: MatDialogConfig = {
      position: {
        top: '0',
        right: '0',
      },
      panelClass: 'modal-lateral'
    }
    switch (modal) {
      case 'movements':
        this.open(MovementsComponent, optionsDialogs);
        break;
    }
  }

  private open(componente: ComponentType<AllowedModals>, config?: MatDialogConfig): void {
    const dialog = this.dialog.open(componente, { ... this.config, ...config });
    this.modals.push(dialog);
  }

  public showModal(modal: Modals): void {
    switch (modal) {
      case 'qrScanner':
        this.open(QrScannerComponent);
        break;
      case 'addSupply':
        this.open(AddSupplyComponent);
        break;
    }
  }


  public override closeModal(): void {
    const modal = this.modals.pop()!;
    modal.close();
  }
}
