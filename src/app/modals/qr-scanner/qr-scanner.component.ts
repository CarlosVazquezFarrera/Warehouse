import { AfterContentChecked, AfterViewInit, Component, ViewChild } from '@angular/core';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { NgxScannerQrcodeModule, LOAD_WASM, NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
LOAD_WASM().subscribe();

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [ModalHeaderComponent, NgxScannerQrcodeModule],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.scss'
})
export class QrScannerComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.scan.start();
  }

  public qrDetected(data: ScannerQRCodeResult[]): void {
    if (data.length >= 0)
      this.scan.stop();
  }
  @ViewChild(NgxScannerQrcodeComponent) private scan!: NgxScannerQrcodeComponent;
}
