import { Component, computed, inject, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { WarehouseStore } from '@store/warehouse.store';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [MatDividerModule, MatIconModule, MatButtonModule, MatListModule, RouterModule],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.scss'
})
export class SidebarItemComponent {
  private store = inject(WarehouseStore);

  icon = input.required<string>();
  text = input.required<string>();
  url = input.required<string>();

  itemClicked() {
    this.store.toggleMenu();
  }

}
