import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ModalsService } from '@services/modals.service';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { EgressComponent } from './egress/egress.component';
import { MatDialogModule } from '@angular/material/dialog';
import { QrComponent } from './qr/qr.component';
import { EntryComponent } from './entry/entry.component';
import { DashboardStore } from '@store/dashboard.store';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [ModalHeaderComponent, MatTabsModule, MatIconModule, EgressComponent, QrComponent, MatDialogModule, EntryComponent],
  templateUrl: './movements.component.html',
  styleUrl: './movements.component.scss'
})
export class MovementsComponent implements OnDestroy {
  ngOnDestroy(): void {
   this.store.clearInventoryItemSelected();
  }

  private store = inject(DashboardStore);
}
