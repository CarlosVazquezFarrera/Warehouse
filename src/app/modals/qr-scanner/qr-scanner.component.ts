import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { NgxScannerQrcodeModule, LOAD_WASM, NgxScannerQrcodeComponent, ScannerQRCodeResult, ScannerQRCodeDevice, ScannerQRCodeConfig } from 'ngx-scanner-qrcode';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { filter } from 'rxjs';
import { Platform } from '@angular/cdk/platform';


LOAD_WASM().subscribe();

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [ModalHeaderComponent, NgxScannerQrcodeModule, MatSelectModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrScannerComponent implements AfterViewInit {

  private fb = inject(FormBuilder);
  public fbCamera = this.fb.group({
    camera: ['']
  });
  public platform = inject(Platform);

  ngAfterViewInit() {
    this.scan.start();
    this.scan.devices
      .pipe(
        filter(devices => devices.length > 0))
      .subscribe(devices => {
        if (!this.platform.ANDROID || ! this.platform.IOS) return;

        const device = devices.find(f => (/back|rear|environment/gi.test(f.label)));
        this.scan.playDevice(device ? device.deviceId : devices[0].deviceId);
      });
    this.camera.valueChanges.subscribe(_ => this.cameraHasChange());
  }
  private cameraHasChange() {
    this.scan.playDevice(this.camera.value!);
  }

  public qrDetected(data: ScannerQRCodeResult[]): void {
    if (data.length >= 0)
      this.scan.stop();
  }
  @ViewChild(NgxScannerQrcodeComponent) public scan!: NgxScannerQrcodeComponent;

  public get cameras(): ScannerQRCodeDevice[] {
    const devices = this.scan?.devices?.value;
    if (!devices) return [];
    return devices;
  }

  private get camera(): AbstractControl {
    return this.fbCamera.get('camera')!;
  }
}
