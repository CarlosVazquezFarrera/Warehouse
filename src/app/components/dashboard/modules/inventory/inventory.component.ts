import { AfterContentInit, Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ActivatedRoute } from '@angular/router';

import { Airport } from '@models/DTO/airport';
import { DashboardStore } from '@store/dashboard.store';
import { ModalsService } from '@services/modals.service';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { environment } from '@environments/environment';
import { InventoryItem } from '@models/api/inventoryItem';
import { MessageService } from '@services/message.service';

import { debounceTime, merge } from 'rxjs';
import * as json from './inventory-metada.json';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatDividerModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    NoDataComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit, AfterContentInit {
  //#region Hooks
  async ngOnInit(): Promise<void> {
    await this.store.getAiports();
    if (this.store.airport().length > 0) {
      const id = this.store.airport()[0].id;
      this.airportId.setValue(id);
    }
    await this.handleSupplyGotByURL();
  }

  ngAfterContentInit() {
    merge(
      this.airportId.valueChanges,
      this.search.valueChanges.pipe(debounceTime(environment.defaultDebounceTime))
    ).subscribe(() => this.store.getInventoryByAirport(this.airportId.value, this.search.value));
  }
  //#endregion

  //#region Properties
  public store = inject(DashboardStore);
  private fb = inject(FormBuilder);
  private modalsService = inject(ModalsService);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  public displayedColumns: string[] = ['name', 'supplierPart', 'currentQuantity'];
  public ariports: Airport[] = [];

  public form = this.fb.group({
    airportId: [''],
    search: ['']
  });
  //#endregion

  //#region Methods
  public supplyClicked(item: InventoryItem): void {
    this.store.setInventyoryItemSelected(item);
    this.modalsService.showLateralModal('movements');
  }
  public clearSearch(): void {
    this.search.patchValue('');
  }

  public scanQr() {
    try {
      navigator.mediaDevices.getUserMedia({ video: true }).then(camera => {
        if (camera) {
          this.modalsService.showModal('qrScanner')
        }
      })
    } catch (error) {
      this.messageService.showMessage(json.cameraNotavailable, 'warning');
    }
  }
  public handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    const pageNumber = e.pageIndex + 1;
    this.store.getInventoryByAirport(this.airportId.value, this.search.value, pageNumber, pageSize);
  }

  private async handleSupplyGotByURL(): Promise<void> {
    const idSupply = this.route.snapshot.paramMap.get('idSupply');

    if (!idSupply) return;
    if (this.store.inventoryItemSelected.id() == '') return;

    this.modalsService.showLateralModal('movements');
  }
  public addMissingProductComponent(): void {
    this.modalsService.showLateralModal('addMissingProduct');
  }
  //#endregion

  //#region Gets
  private get airportId(): AbstractControl {
    return this.form.get('airportId')!;
  }
  public get search(): AbstractControl {
    return this.form.get('search')!;
  }
  //#endregion
}
