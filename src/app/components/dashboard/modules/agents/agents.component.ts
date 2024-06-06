import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { DashboardStore } from '@store/dashboard.store';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, MatButtonModule, MatTableModule, NoDataComponent, MatPaginatorModule, MatTooltipModule, MatMenuModule, MatIconModule],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss'
})
export class AgentsComponent implements OnInit {
  ngOnInit(): void {
    this.store.getPagedAgents();
  }
  public store = inject(DashboardStore);
  displayedColumns: string[] = ['agentNumber', 'shortName', 'name', 'lastName', 'actions'];


  public addAgent(): void {

  }
  public async handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    const pageNumber = e.pageIndex + 1;
    await this.store.getPagedAgents(pageNumber, pageSize);
  }
}
