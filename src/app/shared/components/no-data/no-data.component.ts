import { Component, inject } from '@angular/core';
import { WarehouseStore } from '@store/warehouse.store';
@Component({
  selector: 'app-no-data',
  standalone: true,
  imports: [],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss'
})
export class NoDataComponent {
  public store = inject(WarehouseStore);
}
