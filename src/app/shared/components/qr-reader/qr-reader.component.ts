import { Component, ViewChild } from '@angular/core';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-qr-reader',
  standalone: true,
  imports: [ZXingScannerModule],
  templateUrl: './qr-reader.component.html',
  styleUrl: './qr-reader.component.scss'
})
export class QrReaderComponent {
  public async startCamera(): Promise<HTMLVideoElement> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    const video = document.getElementById('video') as HTMLVideoElement;
    video.srcObject = stream;
    video.play();
    return video;
  }
  @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;
  valueScanned(value: string): void {
    console.log(value);
    this.scanner.scanStop();
  }

  // private async decodeQRCode(video: HTMLVideoElement) {
  //   const codeReader = new BrowserQRCodeReader();
  //   while (true) {
  //     try {
  //       const result = await codeReader.decodeFromVideoElement(video, undefined);
  //       if (result) {
  //         console.log('Código QR detectado:', result.getText());
  //         // Aquí puedes hacer lo que quieras con el código QR, como enviarlo a tu servidor
  //       }
  //     } catch (error) {
  //       console.error('Error al decodificar el código QR:', error);
  //     }
  //     // Esperar un tiempo antes de intentar decodificar de nuevo
  //     await new Promise(resolve => setTimeout(resolve, 100));
  //   }
  // }

}
