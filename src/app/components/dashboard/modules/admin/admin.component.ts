import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AdminAgentsComponent } from './admin-agents/admin-agents.component';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, AdminAgentsComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent  {

  onTabChanged(index: number) {
  }
 
}
