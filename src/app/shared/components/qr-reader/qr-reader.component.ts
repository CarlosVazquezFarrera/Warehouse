import { AfterViewInit, Component, OnDestroy, inject, input, output } from '@angular/core';
import QrScanner from 'qr-scanner';
import { ModalsService } from '@services/modals.service';
import { MessageService } from '@services/message.service';

export type QrResult = {
  valid: boolean,
  text: string
}

@Component({
  selector: 'app-qr-reader',
  standalone: true,
  templateUrl: './qr-reader.component.html',
  styleUrl: './qr-reader.component.scss'
})
export class QrReaderComponent implements AfterViewInit, OnDestroy {


  //#region Properties
  private beep = new Audio("/assets/audio/beep.mp3");
  private video!: HTMLVideoElement;
  private modalService = inject(ModalsService);
  private messageService = inject(MessageService);
  private qrScanner: QrScanner | undefined;

  //#endregion

  //#region Inputs
  patternMatch = input<string>();
  indexPatternMatch = input<number>(0);
  deplay = input<number>(5);

  //#endregion

  //#region Outputs
  public onError = output<string>();
  public onQrScanned = output<QrResult>();

  //#endregion

  //#region Methods
  ngAfterViewInit(): void {
    this.startCamera();
  }

  private async startCamera(): Promise<void> {
    this.video = document.getElementById('video') as HTMLVideoElement;
    try {
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        this.modalService.closeModal();
        this.messageService.showMessage('No camera found');
        return
      }

      const constraints = {
        video: {
          facingMode: 'environment'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = stream;
      this.video.play();

      this.qrScanner = new QrScanner(this.video, result => {
        this.qrScanned(result);
      }, {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 10
      });

      await this.qrScanner.start();

    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }


  ngOnDestroy(): void {
    this.stopScanner();
  }

  private async qrScanned(result: QrScanner.ScanResult) {
    const text = result.data;
    this.beep.play();
    if (this.patternMatch()) {
      const regexPatter = new RegExp(this.patternMatch()!);
      const match = text.match(regexPatter);
      if (!match) {
        this.onQrScanned.emit({ valid: false, text });
        return;
      }
      const matchResult = match[this.indexPatternMatch()];
      this.onQrScanned.emit({ valid: true, text: matchResult })
    }
    else
      this.onQrScanned.emit({ valid: true, text });

    this.stopScanner();
  }

  private stopScanner(): void {


    if (this.qrScanner) {
      this.qrScanner.stop();
      if (this.video && this.video.srcObject) {
        const stream = this.video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        this.video.srcObject = null;
      }

      this.qrScanner.destroy();
      this.qrScanner = undefined;
    }

    // const cameras = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    // cameras.getTracks().forEach(t => t.stop());

    // const videoElem = document.getElementById('video') as HTMLVideoElement;
    // if (videoElem && videoElem.srcObject) {
    //   const stream = videoElem.srcObject as MediaStream;
    //   stream.getTracks().forEach(track => track.stop());
    //   videoElem.srcObject = null;
    // }
  }
  //#endregion
}
