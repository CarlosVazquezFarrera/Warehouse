import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WarehouseStore } from '@store/warehouse.store';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AppRoutes } from '@routes/app-routers';
import { SessionService } from '@services/session.service';
import { ModalsService } from '@services/modals.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public store = inject(WarehouseStore);
  private router = inject(Router);
  private sessionService = inject(SessionService);
  public modalsService = inject(ModalsService);

  public toggle(): void {
    this.store.toggleMenu();
  }
  public async logOut(): Promise<void> {
    const response = await this.modalsService.openDialog('confirmation', 'Are you sure you want to log out?')
    if (response) {
      this.sessionService.logOut();
      this.store.logOut();
      this.router.navigateByUrl(AppRoutes.login);
    }

  }
}


