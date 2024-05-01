import { Component, OnInit, ViewChild } from '@angular/core';
import { sleep } from '@shared/helper/sleep';
import { BrowserQRCodeReader } from '@zxing/browser';


@Component({
  selector: 'app-qr-reader',
  standalone: true,
  templateUrl: './qr-reader.component.html',
  styleUrl: './qr-reader.component.scss'
})
export class QrReaderComponent implements OnInit {
  async ngOnInit(): Promise<void> {
    const video = await this.startCamera();
    await this.decodeQRCode(video);
  }
  public async startCamera(): Promise<HTMLVideoElement> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    const video = document.getElementById('video') as HTMLVideoElement;
    video.srcObject = stream;
    video.play();
    return video;
  }

  private async decodeQRCode(video: HTMLVideoElement) {
    const codeReader = new BrowserQRCodeReader();
    while (true) {
      try {
        codeReader.decodeFromVideoElement(video, (result) => {
          if (result) {
            console.log('Código QR detectado:', result.getText());
          }
        });
      } catch (error) {
        console.error('Error al decodificar el código QR:', error);
      }
      await sleep(100);
    }
  }

}
