import { Injectable } from '@angular/core';
import { DialogBaseService } from './dialog-base.service';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { MovementsComponent } from '@modals/movements/movements.component';
import { QrScannerComponent } from '@modals/qr-scanner/qr-scanner.component';
import { SupplyComponent } from '@modals/supply/supply.component';
import { AddMissingProductComponent } from '@modals/add-missing-product/add-missing-product.component';
import { AgentComponent } from '@modals/agent/agent.component';
type LateralModals = 'movements' | 'supply' | 'addMissingProduct' | 'agent';
type Modals = 'qrScanner';
type AllowedModals = MovementsComponent | QrScannerComponent | SupplyComponent | AddMissingProductComponent | AgentComponent;
@Injectable({
  providedIn: 'root'
})
export class ModalsService extends DialogBaseService<AllowedModals> {
  private modals: Array<MatDialogRef<AllowedModals>> = new Array<MatDialogRef<AllowedModals>>();


  public showLateralModal(modal: LateralModals): void {
   
    switch (modal) {
      case 'movements':
        this.open(MovementsComponent);
        break;
      case 'supply':
        this.open(SupplyComponent);
        break;
      case 'addMissingProduct':
        this.open(AddMissingProductComponent);
        break;
      case 'agent':
        this.open(AgentComponent);
      break;
    }
  }

  private open(componente: ComponentType<AllowedModals>, config?: MatDialogConfig): void {
    let lateralModalConfig: MatDialogConfig = {
      position: {
        top: '0',
        right: '0',
      },
      panelClass: 'modal-lateral',
      ...config
    }
    const dialog = this.dialog.open(componente, { ... this.config, ...lateralModalConfig });
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
