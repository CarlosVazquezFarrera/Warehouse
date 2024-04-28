import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { NgxScannerQrcodeModule, LOAD_WASM, NgxScannerQrcodeComponent, ScannerQRCodeResult, ScannerQRCodeDevice, ScannerQRCodeConfig } from 'ngx-scanner-qrcode';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';


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
  // public config: ScannerQRCodeConfig = {
  //   constraints: {
  //     video: {
  //       width: window.innerWidth
  //     },
  //   },
  //   canvasStyles: [
  //     { /* layer */
  //       lineWidth: 1,
  //       fillStyle: '#00950685',
  //       strokeStyle: '#00950685',
  //     },
  //     { /* text */
  //       font: '17px serif',
  //       fillStyle: '#ff0000',
  //       strokeStyle: '#ff0000',
  //     }
  //   ],
  // };

  private fb = inject(FormBuilder);
  public fbCamera = this.fb.group({
    camera: ['']
  });

  public changeCamera() {

  }
  ngAfterViewInit(): void {
    this.scan.start();
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
