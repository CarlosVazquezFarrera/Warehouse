import { Component, OnDestroy, OnInit, input, output } from '@angular/core';
import { environment } from '@environments/environment';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Result } from '@zxing/library'
import { Observable, debounceTime, map } from 'rxjs';

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
export class QrReaderComponent implements OnInit, OnDestroy {

  //#region Properties
  private stream!: MediaStream;
  private video!: HTMLVideoElement;
  private beep = new Audio("/assets/audio/beep.mp3");
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
  async ngOnInit(): Promise<void> {
    await this.startReading();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private stop(): void {
    this.stream.getTracks().forEach(t => t.stop());
  }

  public async startReading(): Promise<void> {
    await this.startCamera();
    this.decodeFromVideoElementObservable(this.video)
      .pipe(
        debounceTime(environment.qrDefaultDelay * 500),
        map(video => video.getText()),
      )
      .subscribe(result => this.scannedText(result));
  }

  private async startCamera(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    this.video = document.getElementById('video') as HTMLVideoElement;
    this.video.srcObject = this.stream;
    this.video.play();
  }

  private scannedText(text: string): void {
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
  }



  // private decodeQRCode(video: HTMLVideoElement) {
  //   const codeReader = new BrowserQRCodeReader();
  //   try {
  //     codeReader.decodeFromVideoElement(video, (result) => {
  //       if (result) {
  //         this.beep.play();
  //         const scanResult = this.scannedText(result.getText());
  //         if (!scanResult.valid) {
  //           this.onQrDidNotMatchParrent.emit();
  //           return;
  //         }
  //         this.onQrScanned.emit(scanResult.text);
  //       }
  //     });
  //   } catch {
  //     this.onError.emit("Unknown error")
  //   }
  // }

  private decodeFromVideoElementObservable(video: HTMLVideoElement): Observable<Result> {
    return new Observable<Result>(observer => {
      const codeReader = new BrowserQRCodeReader();
      const listener = (result: Result | undefined) => {
        if (result) {
          observer.next(result);
        }
      };
      codeReader.decodeFromVideoElement(video, listener);
    });
  }
  //#endregion
}
