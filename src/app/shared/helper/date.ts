import { formatDate } from '@angular/common';

export function formatDateToUSA(date: Date): string {
  return formatDate(date, 'MM/dd/yyyy', 'en-US');
}

export function starDate(): string {
  const today = new Date();

  const firstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  return formatDateToUSA(firstDay);
}

export function endDate(): string {
  const today = new Date();
  const lastDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  );

  return formatDateToUSA(lastDay);
}
