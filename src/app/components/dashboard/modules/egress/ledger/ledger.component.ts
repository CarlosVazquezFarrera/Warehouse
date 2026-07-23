import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { MaterialModule } from '@shared/modules/material.module';
import { WarehouseStore } from '@store/warehouse.store';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { PageEvent } from '@angular/material/paginator';
import { DecimalPipe } from '@angular/common';
import { LedgerEgressParams } from '@models/requestParams/ledgerEgressParams';
import { formatDateToUSA } from '@shared/helper/date';
import { ExcelExportService } from '@services/excel-export.service';
import { ExcelColumn } from '@models/custom/excelColumn';
import { TotalEgressMovementDto } from '@models/Dto/totalEgressMovementDto';

const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-ledger',
  standalone: true,
  imports: [
    NoDataComponent,
    MaterialModule,
    DecimalPipe
  ],
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
  ],
  templateUrl: './ledger.component.html',
  styleUrl: './ledger.component.scss'
})
export class LedgerComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  public store = inject(WarehouseStore);
  private excelExportService = inject(ExcelExportService);

  public today = new Date();
  public date = this.fb.control(this.today);

  public displayedColumns: string[] = ['name', 'supplierPart', 'totalMovements', 'unitsRemoved'];

  ngOnInit() {
    this.store.getTotalUnitRemoved();
  }
  ngOnDestroy(): void {
    this.store.setLedgerFilter({});
    this.store.clearLedgerPageSize();
  }

  public clearFilter() {
    this.date.reset(this.today, { emitEvent: false })
  }

  public async setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const selectedDate: Date = this.today;
    selectedDate.setMonth(normalizedMonthAndYear.month());
    selectedDate.setFullYear(normalizedMonthAndYear.year());
    this.date.setValue(selectedDate);
    this.store.setLedgerFilter(this.filters);
    await this.store.getTotalUnitRemoved(1);
    datepicker.close();
  }
  public handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    this.store.setLedgerPageSize(pageSize);
    this.store.getTotalUnitRemoved(e.pageIndex + 1);
  }

  public exportToExcel() {
    const excelColumns: ExcelColumn<TotalEgressMovementDto>[] = [
      { key: 'name', header: 'Product Name' },
      { key: 'supplierPart', header: 'SupplierPart' },
      { key: 'unitsRemoved', header: 'Units Removed' },
      { key: 'totalMovements', header: 'Total Egress Transactions' },
    ];
    this.excelExportService.exportToExcel(this.store.ledgerEgressMovement.data(), excelColumns, 'ledger');
  }

  private get filters(): LedgerEgressParams {
    return {
      date: formatDateToUSA(this.today)
    }
  }
}


