import { Component, inject } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { downloadHTMLElement } from '@shared/helper/download-file';
import { printHTMLElement } from '@shared/helper/printer';
import { Platform } from '@angular/cdk/platform';
import { WarehouseStore } from '@store/warehouse.store';


@Component({
  selector: 'app-qr',
  standalone: true,
  imports: [QRCodeModule, MatButtonModule, MatIconModule],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.scss'
})
export class QrComponent {

  public store = inject(WarehouseStore);
  public platform = inject(Platform);

  public async download(): Promise<void> {
    await downloadHTMLElement('qr', this.store.selectedProduct()!.name, 'jpeg');
  }
  public async print() {
    await printHTMLElement('qr');
  }


  public get dataQr(): string {
    const name = this.store.selectedProduct()!.name;
    return `ProductName=${name}`;
  }
}
