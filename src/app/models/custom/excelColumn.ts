export interface ExcelColumn <T> {
  key: keyof T;
  header: string;
  format?: (value: T[keyof T], row: T) => any;
}
