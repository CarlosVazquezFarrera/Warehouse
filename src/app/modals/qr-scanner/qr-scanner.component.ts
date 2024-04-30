import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { NgxScannerQrcodeModule, LOAD_WASM, NgxScannerQrcodeComponent, ScannerQRCodeResult, ScannerQRCodeDevice } from 'ngx-scanner-qrcode';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { filter } from 'rxjs';
import { DasboardStore } from '@store/dashboard.store';
import { ModalsService } from '@services/modals.service';
import { SnackService } from '@services/snack.service';
import * as json from './qr-metadata.json';
import { sleep } from '@shared/helper/sleep';
import { environment } from '@environments/environment';
import { QrReaderComponent } from '@shared/components/qr-reader/qr-reader.component';

LOAD_WASM().subscribe();

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [ModalHeaderComponent, NgxScannerQrcodeModule, MatSelectModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatIconModule, QrReaderComponent],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrScannerComponent implements AfterViewInit {

  private fb = inject(FormBuilder);
  public fbCamera = this.fb.group({
    camera: ['']
  });

  private store = inject(DasboardStore);
  private modalsService = inject(ModalsService);
  private snackService = inject(SnackService)
  private supplyIdTegex = new RegExp("^IdSupply=([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$");
  @ViewChild(NgxScannerQrcodeComponent) public scan!: NgxScannerQrcodeComponent;


  ngAfterViewInit() {
    this.scan.start();
    this.scan.devices
      .pipe(
        filter(devices => devices.length > 0)
      )
      .subscribe(devices => {
        const device = devices.find(f => (/back|rear|environment/gi.test(f.label)));
        const idCamera = device ? device.deviceId : devices[0].deviceId;
        this.camera.setValue(idCamera);
        this.scan.playDevice(idCamera);
      });
    this.camera.valueChanges.subscribe(_ => this.cameraHasChange());
  }
  private cameraHasChange() {
    this.scan.playDevice(this.camera.value!);
  }

  public async qrDetected(data: ScannerQRCodeResult[]): Promise<void> {
    if (data.length >= 0)
      this.scan.stop();

    const match = data[0].value.match(this.supplyIdTegex);
    if (!match) {
      this.snackService.showAutoCloseMessage(json.qrInvalid);
      await sleep(environment.qrDefaultDelay);
      this.scan.start();
      return
    }
    const idSupply = match[1] ?? '';
    if (idSupply == '') return;

    await this.store.loadSupply(idSupply);
    if (this.store.supplySelected.id() == '') return;
    this.modalsService.closeModal();
    this.modalsService.showLateralModal('movements');
  }



  public get cameras(): ScannerQRCodeDevice[] {
    const devices = this.scan?.devices?.value;
    if (!devices) return [];
    return devices;
  }

  private get camera(): AbstractControl {
    return this.fbCamera.get('camera')!;
  }
}
