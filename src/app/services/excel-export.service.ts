import { Injectable } from '@angular/core';
import { ExcelColumn } from '@models/custom/excelColumn';
import {  WorkSheet, utils, writeFile } from "xlsx";

type files = 'movements' | 'ledger'

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  exportToExcel<T>(data: T[], columns: ExcelColumn<T>[], fileName: files): void {
    const rows = data.map(row => this.mapRow(row, columns));
    const worksheet: WorkSheet = utils.json_to_sheet(rows);
    this.autoFitColumns(worksheet, rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const now = new Date();
    writeFile(workbook, `${fileName}-${now.toISOString()}.xlsx`);
  }
  private mapRow<T>(row: T, columns: ExcelColumn<T>[]): Record<string, any> {
    const mappedRow: Record<string, any> = {};
    columns.forEach(col => {
      mappedRow[col.header] = col.format ? col.format(row[col.key], row) : row[col.key];
    });
    return mappedRow;
  }

  private autoFitColumns(worksheet: WorkSheet, rows: Record<string, any>[]): void {
    const columKeys = Object.keys(rows[0]);
    worksheet['!cols'] = columKeys.map(key => {
      const maxLength = Math.max(...rows.map(row => String(row[key] ?? '').length));
      return { wch: maxLength + 2 };
    });
  }
}
