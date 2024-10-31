import { Component, inject } from '@angular/core';
import { WarehouseStore } from '@store/warehouse.store';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './header/header.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { SidebarItemComponent } from '@shared/components/sidebar-item/sidebar-item.component';
import { DashboardItem } from '@models/custom/dashBoardItem';
import { getChildRoutePath } from '@routes/app-routers';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatSidenavModule, HeaderComponent, RouterOutlet, MatListModule, MatIconModule, SidebarItemComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor() {
    this.store.agent()
  }
  public store = inject(WarehouseStore);

  public menuItems: Array<DashboardItem> = [
    { url: getChildRoutePath("dashboard", "inventory"), icon: 'inventory', text: 'Inventory'},
    { url: getChildRoutePath("dashboard", "products"), icon: 'list', text: 'Products'},
    { url: getChildRoutePath("dashboard", "agents"), icon: 'group', text: 'Agents'},
    { url: getChildRoutePath("dashboard", "admin"), icon: 'admin_panel_settings', text: 'Admin'}

  ]
}
