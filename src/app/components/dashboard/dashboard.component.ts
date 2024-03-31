import { Component, inject } from '@angular/core';
import { WarehouseStore } from '@store/warehouse.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor() {
    this.store.agent()
  }
  public store = inject(WarehouseStore);
}
