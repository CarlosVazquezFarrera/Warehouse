import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { MovementsComponent } from '@modals/movements/movements.component';
import { QrScannerComponent } from '@modals/qr-scanner/qr-scanner.component';
import { CreateEgressComponent } from '@modals/create-egress/create-egress.component';
import { SelectProductsComponent } from '@modals/select-products/select-products.component';
import { LoadingComponent } from '@modals/loading/loading.component';
import { ConfirmationComponent } from '@modals/confirmation/confirmation.component';
import { lastValueFrom, Observable } from 'rxjs';
import { MessageComponent } from '@modals/message/message.component';
import { ProductComponent } from '@modals/product/product.component';

type AllowedModalName = 'movements' | 'create-egress' | 'select-products' | 'product' | 'qrScanner' | 'loading';
type AllowedDialogName = 'confirmation' | 'information';
type typeModal = 'center' | 'lateral'
type typeTitle = 'Warning' | 'Something went wrong'


@Injectable({
  providedIn: 'root'
})
export class ModalsService {

  private modals: Array<MatDialogRef<any>> = [];
  private dialog: MatDialog = inject(MatDialog);
  private baseConfig: MatDialogConfig = {
    disableClose: true,
  };
  private readonly MODAL_COMPONENTS: Record<AllowedModalName, ComponentType<any>> = {
    'movements': MovementsComponent,
    'create-egress': CreateEgressComponent,
    'select-products': SelectProductsComponent,
    'product': ProductComponent,
    'qrScanner': QrScannerComponent,
    'loading': LoadingComponent
  };
  private readonly DIALOG_COMPONENTS: Record<AllowedDialogName, ComponentType<any>> = {
    'confirmation': ConfirmationComponent,
    'information': MessageComponent
  }

  public open(modalName: AllowedModalName, type: typeModal = 'lateral', customConfig?: MatDialogConfig): MatDialogRef<any> {
    const component = this.MODAL_COMPONENTS[modalName];
    const dialog = this.dialog.open(component, this.config(type, customConfig));
    this.modals.push(dialog);
    return dialog;
  }

  public async openDialog(dialogame: AllowedDialogName, message: string, title: typeTitle = 'Warning') {
    const component = this.DIALOG_COMPONENTS[dialogame];
    const dialog = this.dialog.open(component, { ... this.config, data: { message, title } });
    return await lastValueFrom(dialog.afterClosed() as Observable<boolean>)
  }

  public close() {
    const modal = this.modals.pop();
    modal?.close();
  }

  private config(type: typeModal, customConfig?: MatDialogConfig): MatDialogConfig {
    if (customConfig)
      return { ...this.baseConfig, ...customConfig }
    return type == 'center' ? this.centralConfig : this.lateralConfig;
  }

  private get lateralConfig(): MatDialogConfig {
    return {
      ...this.baseConfig,
      position: {
        top: '0',
        right: '0',
      },
      panelClass: 'modal-lateral',
    }
  }

  private get centralConfig(): MatDialogConfig {
    return {
      ...this.baseConfig,
      panelClass: 'modal-regular'
    }
  }
}
