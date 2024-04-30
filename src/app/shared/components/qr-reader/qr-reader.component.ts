import { Component } from '@angular/core';

@Component({
  selector: 'app-qr-reader',
  standalone: true,
  imports: [],
  templateUrl: './qr-reader.component.html',
  styleUrl: './qr-reader.component.scss'
})
export class QrReaderComponent {
  public async startCamera(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    const video = document.getElementById('video') as HTMLVideoElement;
    video.srcObject = stream;
    video.play();
  }
}
