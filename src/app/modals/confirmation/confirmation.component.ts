import { Component, Inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MessageParams } from '../models/messageParams';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatDividerModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: MessageParams) {
    this.message.set(data.message);
    this.tittle.set(data.title);
  }
  public message = signal('');
  public tittle = signal('');

}
