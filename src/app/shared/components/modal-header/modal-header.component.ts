import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ModalsService } from '@services/modals.service';
@Component({
  selector: 'app-modal-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './modal-header.component.html',
  styleUrl: './modal-header.component.scss'
})
export class ModalHeaderComponent {
  private modalsService = inject(ModalsService);

  public header = input<string>();

  public close() {
    this.modalsService.closeModal();
  }
}
