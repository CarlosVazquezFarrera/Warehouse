import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '@environments/environment';
import { AgentBaseInfo } from '@models/types/agentBaseInfo';
import { ModalsService } from '@services/modals.service';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { DashboardStore } from '@store/dashboard.store';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    NoDataComponent,
    MatPaginatorModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss'
})
export class AgentsComponent implements OnInit {
  constructor() {
    this.search.valueChanges.pipe(debounceTime(environment.defaultDebounceTime)).subscribe(() => this.store.getPagedAgents(undefined, undefined, this.search.value));
  }
  ngOnInit(): void {
    this.store.getPagedAgents();
  }

  //#region Properties
  public store = inject(DashboardStore);
  private modalsService = inject(ModalsService);
  public search = new FormControl();
  public displayedColumns: string[] = ['agentNumber', 'shortName', 'name', 'lastName', 'actions'];
  //#endregion


  //#region Methods
  public async handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    const pageNumber = e.pageIndex + 1;
    await this.store.getPagedAgents(pageNumber, pageSize);
  }

  clearSerach(): void {
    this.search.setValue('')
  }
  public addAgent(): void {
    this.modalsService.showLateralModal('agent');
  }
  public editAgent(agentId: string): void {
    this.store.setAgentId(agentId);
    this.modalsService.showLateralModal('agent');
  }
  //#endregion
}
