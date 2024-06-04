import { Component, inject } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardStore } from '@store/dashboard.store';
import { downloadHTMLElement } from '@shared/helper/download-file';
import { printHTMLElement } from '@shared/helper/printer';
import { Platform } from '@angular/cdk/platform';


@Component({
  selector: 'app-qr',
  standalone: true,
  imports: [QRCodeModule, MatButtonModule, MatIconModule],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.scss'
})
export class QrComponent {

  public store = inject(DashboardStore);
  public platform = inject(Platform);

  public async download(): Promise<void> {
    await downloadHTMLElement('qr', this.store.inventoryItemSelected.name(), 'jpeg');
  }
  public async print() {
    await printHTMLElement('qr');
  }


  public get dataQr(): string {
    const id = this.store.inventoryItemSelected.id();
    return `IdSupply=${id}`;
  }
}
