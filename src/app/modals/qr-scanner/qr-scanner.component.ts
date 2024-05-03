import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DasboardStore } from '@store/dashboard.store';
import { ModalsService } from '@services/modals.service';
import { SnackService } from '@services/snack.service';
import { QrReaderComponent, QrResult } from '@shared/components/qr-reader/qr-reader.component';
import * as json from './qr-metadata.json';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [ModalHeaderComponent, MatDialogModule,  QrReaderComponent],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrScannerComponent {
  private store = inject(DasboardStore);
  private modalsService = inject(ModalsService);
  private snackService = inject(SnackService);
  public supplyIdTegex = "^IdSupply=([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$";


  public async qrDetected(scan: QrResult) {
    if (!scan.valid)  {
      this.snackService.showAutoCloseMessage(json.qrInvalid);
      return
    };
    await this.store.loadSupply(scan.text);
    if (this.store.supplySelected.id() == '') return;
    this.modalsService.closeModal();
    this.modalsService.showLateralModal('movements');
  }
}
