import { Component, inject, OnDestroy } from '@angular/core';
import { MaterialModule } from '@shared/modules/material.module';
import { ActivityComponent } from './activity/activity.component';
import { LedgerComponent } from './ledger/ledger.component';
import { KardexComponent } from './kardex/kardex.component';
import { WarehouseStore } from '@store/warehouse.store';

@Component({
  selector: 'app-egress',
  standalone: true,
  imports: [
    ActivityComponent,
    LedgerComponent,
    KardexComponent,
    MaterialModule,
],
  templateUrl: './egress.component.html',
  styleUrl: './egress.component.scss'
})
export class EgressComponent implements OnDestroy {
  ngOnDestroy(): void {
    this.store.clearActivityFilters();
    this.store.clearActivityPagedSize();
  }

  private store = inject(WarehouseStore);
}
