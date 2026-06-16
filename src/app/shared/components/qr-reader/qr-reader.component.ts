import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, input, output } from '@angular/core';
import { ModalsService } from '@services/modals.service';
import QrScanner from 'qr-scanner';

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
  private modalsService = inject(ModalsService);
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
    this.stopScanner();
  }


  setResult(result: QrScanner.ScanResult) {
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

  async initScanner(): Promise<void> {
    const hasCamera = await QrScanner.hasCamera();

    if (!hasCamera) {
      this.modalsService.openDialog('information', 'Camera not found')
      return;
    }
    const videoElem = this.video.nativeElement;
    this.qrScanner = new QrScanner(videoElem, result => this.setResult(result), {
      highlightScanRegion: true,
      highlightCodeOutline: true,
      maxScansPerSecond: 10
    });
    await this.qrScanner.start();
  }

  private stopScanner(): void {
    this.qrScanner?.stop();
  }

  //#endregion
}
