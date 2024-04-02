import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WarehouseStore } from '@store/warehouse.store';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { SesionService } from '@services/sesion.service';
import { AppRoutes } from '@routes/app-routers';
import { MessageService } from '@services/message.service';

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
  private sesionService = inject(SesionService);
  public messageService = inject(MessageService);

  public toggle(): void {
    this.store.toggleMenu();
  }
  public async logOut(): Promise<void> {
    const response = await this.messageService.confirmationMessage('Are you sure you want to log out?', 'Warning');
    if (response) {
      this.sesionService.logOut();
      this.store.logOut();
      this.router.navigateByUrl(AppRoutes.login);
    }

  }
}


