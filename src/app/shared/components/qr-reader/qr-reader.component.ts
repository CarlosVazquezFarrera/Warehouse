import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, input, output } from '@angular/core';
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
  private modalService = inject(ModalsService);
  private messageService = inject(MessageService);
  private qrScanner: QrScanner | undefined;

  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;


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
    this.initScanner();
  }

  ngOnDestroy(): void {
    this.qrScanner?.stop();
  }


  setResult(result: QrScanner.ScanResult) {

  }

  async initScanner() {
    const videoElem = this.video.nativeElement;
    this.qrScanner = new QrScanner(videoElem, result => this.setResult(result), {
      highlightScanRegion: true,
      highlightCodeOutline: true,
      preferredCamera: "user"
    });

    try {
      const hasCamera = await QrScanner.hasCamera();

      if (!hasCamera) {
        this.messageService.showMessage('Camera not found');
        return;
      }


      await this.qrScanner.start();
      const cameras = await QrScanner.listCameras(true);
      console.log(cameras)
      // await this.qrScanner?.setCamera()
    }
    catch {

    }
  }

  //#endregion
}
