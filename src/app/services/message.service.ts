import { Injectable } from '@angular/core';
import { DialogBaseService } from './dialog-base.service';
import { MessageComponent } from '../modals/message/message.component';
import { MessageParams } from '../modals/models/messageParams';
import { Observable, lastValueFrom } from 'rxjs';
import { ConfirmationComponent } from '../modals/confirmation/confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends DialogBaseService<MessageComponent | ConfirmationComponent> {

  showMessage(message: string, title?: string) {
    const dataMessage: MessageParams = {
      message,
      title: this.tittleText(title)
    }
    this.dialogRef = this.dialog.open(MessageComponent, { ... this.config, data: dataMessage })
  }

  async confirmationMessage(message: string, title?: string): Promise<boolean> {
    const dataMessage: MessageParams = {
      message,
      title: this.tittleText(title)
    }
    this.dialogRef = this.dialog.open(ConfirmationComponent, { ... this.config, data: dataMessage });
    return await lastValueFrom(this.dialogRef.afterClosed() as Observable<boolean>);
  }

  protected tittleText(title: string | undefined): string {
    return title ?? 'Error'
  }
}
