import { Component, inject, OnInit } from '@angular/core';
import { AdminDashBoardStore } from '@store/admin.store';
import { MatTableModule } from '@angular/material/table';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ModalsService } from '@services/modals.service';
import { AgentBaseInfo } from '@models/types/agentBaseInfo';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-admin-agents',
  standalone: true,
  imports: [MatTableModule, 
    NoDataComponent, 
    MatPaginatorModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,],
  templateUrl: './admin-agents.component.html',
  styleUrl: './admin-agents.component.scss'
})
export class AdminAgentsComponent implements OnInit {
  public store = inject(AdminDashBoardStore);
  private modalsService = inject(ModalsService);
  public displayedColumns: string[] = ['agentNumber', 'shortName', 'name', 'lastName', 'actions'];
  
  ngOnInit(): void {
    this.store.getPagedAgents();
  }


  public setPassword(agent: AgentBaseInfo): void {
    this.store.agentSelected(agent);
    this.modalsService.showLateralModal('admin-agent');
  }


  public async handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    const pageNumber = e.pageIndex + 1;
    await this.store.getPagedAgents(pageNumber, pageSize);
  }
}
