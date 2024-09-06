import { Injectable } from '@angular/core';
import { DialogBaseService } from './dialog-base.service';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { MovementsComponent } from '@modals/movements/movements.component';
import { QrScannerComponent } from '@modals/qr-scanner/qr-scanner.component';
import { SupplyComponent } from '@modals/supply/supply.component';
import { AddMissingProductComponent } from '@modals/add-missing-product/add-missing-product.component';
import { AgentComponent } from '@modals/agent/agent.component';
import { AdminAgentComponent } from '@modals/admin-agent/admin-agent.component';

type LateralModals = 'movements' | 'supply' | 'addMissingProduct' | 'agent' | 'admin-agent';
type Modals = 'qrScanner';

type AllowedModals = 
MovementsComponent | 
QrScannerComponent | 
SupplyComponent | 
AddMissingProductComponent | 
AgentComponent | 
AdminAgentComponent;

@Injectable({
  providedIn: 'root'
})
export class ModalsService extends DialogBaseService<AllowedModals> {
  private modals: Array<MatDialogRef<AllowedModals>> = new Array<MatDialogRef<AllowedModals>>();


  public showLateralModal(modal: LateralModals): void {
    let lateralModalConfig: MatDialogConfig = {
      position: {
        top: '0',
        right: '0',
      },
      panelClass: 'modal-lateral',
    }
   
    switch (modal) {
      case 'movements':
        this.open(MovementsComponent, lateralModalConfig);
        break;
      case 'supply':
        this.open(SupplyComponent, lateralModalConfig);
        break;
      case 'addMissingProduct':
        this.open(AddMissingProductComponent, lateralModalConfig);
        break;
      case 'agent':
        this.open(AgentComponent, lateralModalConfig);
      break;
      case 'admin-agent':
        this.open(AdminAgentComponent, lateralModalConfig);
        break;
    }
  }

  private open(componente: ComponentType<AllowedModals>, config?: MatDialogConfig): MatDialogRef<AllowedModals> {
    const dialog = this.dialog.open(componente, { ... this.config, ...config });
    this.modals.push(dialog);
    return dialog;
  }

  public showModal(modal: Modals): MatDialogRef<AllowedModals> {
    switch (modal) {
      case 'qrScanner':
       return this.open(QrScannerComponent);
    }
  }


  public override closeModal(): void {
    const modal = this.modals.pop()!;
    modal.close();
  }
}
