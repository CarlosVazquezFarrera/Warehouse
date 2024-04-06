import { Component, inject } from '@angular/core';
import { ModalsService } from '@services/modals.service';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { EgressComponent } from './egress/egress.component';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [ModalHeaderComponent, MatTabsModule, MatIconModule, EgressComponent],
  templateUrl: './movements.component.html',
  styleUrl: './movements.component.scss'
})
export class MovementsComponent {
  private modalsService = inject(ModalsService);
}
