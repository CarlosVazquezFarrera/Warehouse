import { Component, computed, inject, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { WarehouseStore } from '@store/warehouse.store';
import { IsActiveMatchOptions, Router, RouterModule } from '@angular/router';
import { IsActiveDirective } from '@shared/directives/is-active.directive';

@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [MatDividerModule, MatIconModule, MatButtonModule, MatListModule, RouterModule, IsActiveDirective],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.scss'
})
export class SidebarItemComponent {
  private store = inject(WarehouseStore);
  private router = inject(Router);

  icon = input.required<string>();
  text = input.required<string>();
  url = input.required<string>();

  itemClicked() {
    this.store.toggleMenu();
    this.router.navigateByUrl(this.url());
  }

  public get isActivated(): boolean {
    const option: IsActiveMatchOptions = { paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored' }
    return this.router.isActive(this.url(), option);
  };

}
