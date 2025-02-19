import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DashboardStore } from '@store/dashboard.store';
import { ModalsService } from '@services/modals.service';
import { SnackService } from '@services/snack.service';
import { QrReaderComponent, QrResult } from '@shared/components/qr-reader/qr-reader.component';
import * as json from './qr-metadata.json';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [ModalHeaderComponent, MatDialogModule, QrReaderComponent],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrScannerComponent implements OnInit {

  private store = inject(DashboardStore);
  private modalsService = inject(ModalsService);
  private snackService = inject(SnackService);
  public supplyIdTegex =  "^ProductName=\s*(.+)$";

  ngOnInit(): void {
    this.store.resetProductNameScanned();
  }
  
  public async qrDetected(scan: QrResult) {
    if (!scan.valid) {
      this.snackService.showAutoCloseMessage(json.qrInvalid);
      return
    };

    this.store.setProductNameScanned(scan.text);
    this.modalsService.closeModal();
  }
}
