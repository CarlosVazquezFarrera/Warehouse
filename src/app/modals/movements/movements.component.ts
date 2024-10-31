import { Component, OnDestroy, inject } from '@angular/core';
import { EgressComponent } from './egress/egress.component';
import { QrComponent } from './qr/qr.component';
import { EntryComponent } from './entry/entry.component';
import { DashboardStore } from '@store/dashboard.store';
import { MaterialModule } from '@shared/modules/material.module';
import { FormModule } from '@shared/modules/form.module';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [
    FormModule,
    MaterialModule,
    EgressComponent, 
    QrComponent, 
    EntryComponent],
  templateUrl: './movements.component.html',
  styleUrl: './movements.component.scss'
})
export class MovementsComponent implements OnDestroy {
  ngOnDestroy(): void {
   this.store.resetSelectedProduct();
  }

  private store = inject(DashboardStore);
}
