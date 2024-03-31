import { Injectable, inject } from '@angular/core';
import { DialogBaseService } from './dialog-base.service';
import { MessageComponent } from '../modals/message/message.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { MessageParams } from '../modals/models/messageParams';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends DialogBaseService<MessageComponent> {

  showMessage(message: string, title?: string ) {
    const dataMessage: MessageParams = {
      message,
      title: title ?? 'Error'
    }
    const options: MatDialogConfig = {
      ...this.config,
      data: dataMessage
    }
    this.dialogRef = this.dialog.open(MessageComponent, options)
  }
}
