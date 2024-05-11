import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { DashboardStore } from '@store/dashboard.store';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';


@Component({
  selector: 'app-supplies',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, MatButtonModule, MatTableModule, NoDataComponent, MatPaginatorModule],
  templateUrl: './supplies.component.html',
  styleUrl: './supplies.component.scss'
})
export class SuppliesComponent implements OnInit {
  async ngOnInit(): Promise<void> {
    await this.store.loadProducts();
  }
  private fb = inject(FormBuilder);
  public store = inject(DashboardStore);
  displayedColumns: string[] = ['name', 'supplierPart'];
  dataSource = []
  public form = this.fb.group({
    search: ['']
  });


  public async handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    const pageNumber = e.pageIndex + 1;
    await this.store.loadProducts(pageNumber, pageSize);
    //this.store.getInventoryByAirport(this.airportId.value, this.search.value, pageNumber, pageSize);
  }

  public get search(): AbstractControl {
    return this.form.get('search')!;
  }
}
