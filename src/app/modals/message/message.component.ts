import { Component, Inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MessageParams } from '../models/messageParams';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: MessageParams) {
    this.messageError.set(data.message);
    this.tittleError.set(data.title);
  }
  public messageError = signal('');
  public tittleError = signal('');

}
