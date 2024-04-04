import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Airport } from '@models/DTO/airport';
import { DasboardStore } from '@store/dashboard.store';
import { JsonPipe } from '@angular/common';
import { ResponsiveMatTableDirective } from '@directives/responsive-mat-table.directive';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatTableModule, MatDividerModule, MatPaginatorModule, MatIconModule, MatButtonModule, ReactiveFormsModule, ResponsiveMatTableDirective],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  ngOnInit(): void {
    this.dashBoarStore.getAiports();
    this.airportId.valueChanges.subscribe(idAirport => this.dashBoarStore.getInventoryByAirport(idAirport))
  }
  public dashBoarStore = inject(DasboardStore);
  private fb = inject(FormBuilder);

  public ariports: Airport[] = [];

  public form = this.fb.group({
    airportId: [''],
    search: ['']
  });
  displayedColumns: string[] = ['name', 'supplierPart', 'currentQuantity', 'airport'];

  private get airportId(): AbstractControl {
    return this.form.get('airportId')!;
  }

  public itemClicked(item:Airport): void {
    console.log(item)
  }
}
