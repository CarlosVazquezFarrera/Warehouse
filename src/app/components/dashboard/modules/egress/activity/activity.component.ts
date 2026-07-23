import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivityEngressParams } from '@models/requestParams/activityEngressParams';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { MaterialModule } from '@shared/modules/material.module';
import { WarehouseStore } from '@store/warehouse.store';
import { filter } from 'rxjs';
import { formatDate } from '@angular/common';
import { CustomDatePipe } from '@shared/pipes/custom-date.pipe';
import { ExcelExportService } from '@services/excel-export.service';
import { ExcelColumn } from '@models/custom/excelColumn';
import { EgressDto } from '@models/Dto/egressDto';
import { formatDateToUSA } from '@shared/helper/date';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    MaterialModule,
    NoDataComponent,
    CustomDatePipe
  ],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent implements OnInit {

  public store = inject(WarehouseStore);
  private fb = inject(FormBuilder);

  private excelExportService = inject(ExcelExportService);
  public maxDate: Date = new Date();

  public displayedColumns: string[] = ['productName', 'amountRemoved', 'quantityAfter', 'quantityBefore', 'date', 'approverName'];

  public range = this.fb.group({
    start: [],
    end: [],
  });

  ngOnInit() {
    this.store.searchEgresses(1);
    this.range
      .valueChanges
      .pipe(
        filter(() => this.startDateHasValue && this.endDateHasValue)
      )
      .subscribe(_ => {
        this.store.setActivityFilters(this.dateFilters);
        this.store.searchEgresses(1);
      });

  }

  public clearFilter() {
    this.range.reset({}, { emitEvent: false });
    this.store.setActivityFilters();
    this.store.searchEgresses(1);
  }

  public handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    this.store.setActivityPagedSize(pageSize);
    this.store.searchEgresses(e.pageIndex + 1);
  }

  public exportToExcel() {
    const excelColumns: ExcelColumn<EgressDto>[] = [
      { key: 'productName', header: 'Product' },
      { key: 'amountRemoved', header: 'Amount Removed' },
      { key: 'quantityAfter', header: 'Quantity After' },
      { key: 'quantityBefore', header: 'Quantity Before' },
      { key: 'date', header: 'Date', format: (value) => formatDateToUSA(new Date(value!)) },
      { key: 'approverName', header: 'Approver' }
    ];
    this.excelExportService.exportToExcel(this.store.pagesEgresses.data(), excelColumns, 'movements');
  }
  private get dateFilters(): ActivityEngressParams {
    return {
      startDate: this.starDate,
      endDate: this.endDate
    }
  }

  private get endControl(): FormControl {
    return this.range.get('end')! as FormControl;
  }
  private get startControl(): FormControl {
    return this.range.get('start')! as FormControl;
  }

  private get starDate() {
    return formatDateToUSA(this.startControl!.value!);
  }
  private get endDate() {
    return formatDateToUSA(this.endControl!.value!);
  }
  private get startDateHasValue(): boolean {
    return !!this.range.get('start')?.value;
  }

  private get endDateHasValue(): boolean {
    return !!this.range.get('end')?.value;
  }


}
