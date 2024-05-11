import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { DashboardStore } from '@store/dashboard.store';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { ModalsService } from '@services/modals.service';


@Component({
  selector: 'app-supplies',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, MatButtonModule, MatTableModule, NoDataComponent, MatPaginatorModule],
  templateUrl: './supplies.component.html',
  styleUrl: './supplies.component.scss'
})
export class SuppliesComponent implements OnInit {
  //#region Properties
  private fb = inject(FormBuilder);
  public store = inject(DashboardStore);
  private modalService = inject(ModalsService);
  displayedColumns: string[] = ['name', 'supplierPart'];
  dataSource = []
  public form = this.fb.group({
    search: ['']
  });
  //#endregion

  //#region Methods
  async ngOnInit(): Promise<void> {
    await this.store.loadProducts();
  }

  public addSupply(): void {
    this.modalService.showModal('addSupply');
  }

  public async handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    const pageNumber = e.pageIndex + 1;
    await this.store.loadProducts(pageNumber, pageSize);
  }
  //#endregion

  //#region Gets
  public get search(): AbstractControl {
    return this.form.get('search')!;
  }
  //#endregion
}
