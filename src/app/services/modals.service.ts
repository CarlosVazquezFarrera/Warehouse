import { Injectable } from '@angular/core';
import { DialogBaseService } from './dialog-base.service';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { MovementsComponent } from '@modals/movements/movements.component';
import { QrScannerComponent } from '@modals/qr-scanner/qr-scanner.component';
import { SupplyComponent } from '@modals/supply/supply.component';
import { AddMissingProductComponent } from '@modals/add-missing-product/add-missing-product.component';
type LateralModals = 'movements' | 'supply' | 'addMissingProduct';
type Modals = 'qrScanner' ;
type AllowedModals = MovementsComponent | QrScannerComponent | SupplyComponent | AddMissingProductComponent;
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
        case 'supply':
        this.open(SupplyComponent, optionsDialogs);
        break;
        case 'addMissingProduct':
          this.open(AddMissingProductComponent, optionsDialogs);
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
    }
  }


  public override closeModal(): void {
    const modal = this.modals.pop()!;
    modal.close();
  }
}
