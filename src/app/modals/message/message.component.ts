import { Component, Inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MessageParams } from '../../models/custom/messageParams';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: MessageParams) {
    this.message.set(data.message);
    this.tittle.set(data.title);
  }
  public message = signal('');
  public tittle = signal('');

}
