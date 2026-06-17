import { AfterContentInit, Component, inject, input, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { environment } from '@environments/environment';
import { ProductSearch } from '@models/requestParams/productSearch';
import { ModalsService } from '@services/modals.service';
import { bounce } from '@shared/animations/bounce';
import { fadeInOut } from '@shared/animations/fadeInOut';
import { MaterialModule } from '@shared/modules/material.module';
import { WarehouseStore } from '@store/warehouse.store';
import { debounceTime, lastValueFrom, merge } from 'rxjs';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  animations: [fadeInOut, bounce],
  imports: [MaterialModule],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.scss'
})
export class ProductFiltersComponent implements AfterContentInit {
  //#region Properties
  private fb = inject(FormBuilder);
  public store = inject(WarehouseStore);
  private modalsService = inject(ModalsService);

  private filtersApplied!: ProductSearch;

  public form = this.fb.group({
    search: [null],
    packagingTypeId: [null],
    productFormatId: [null],
    categoryId: [null]
  });

  public isOpened = signal<boolean>(false);

  public showFiltersButton = input<boolean>(true);
  public showScanButton = input<boolean>(true);
  public filtersHasChanged = output<ProductSearch>();


  //#endregion

  //#region Methods

  public ngAfterContentInit(): void {
    merge(
      this.productFormatId.valueChanges,
      this.packagingTypeId.valueChanges,
      this.categoryId.valueChanges,
    ).subscribe(() => {
      this.applyFilters();
    });

    this.search.valueChanges
      .pipe(debounceTime(environment.defaultDebounceTime))
      .subscribe(() => this.applyFilters());
  }

  public toggleFilters() {
    this.isOpened.set(!this.isOpened());
  }

  public clearFilters() {
    this.search.setValue(null, { emitEvent: false });
    this.productFormatId.setValue(null, { emitEvent: false });
    this.packagingTypeId.setValue(null, { emitEvent: false });
    this.categoryId.setValue(null, { emitEvent: false });
    this.applyFilters();
  }

  public clearPackagingType($event: MouseEvent) {
    $event.stopPropagation();
    this.packagingTypeId.setValue(null);
  }
  public clearProductFormat($event: MouseEvent) {
    $event.stopPropagation();
    this.productFormatId.setValue(null);
  }
  public clearCategory($event: MouseEvent) {
    $event.stopPropagation();
    this.categoryId.setValue(null);
  }
  public clearSearch($event: MouseEvent) {
    $event.stopPropagation();
    this.search.setValue(null, { emitEvent: false });
    this.applyFilters();
  }

  public async scanQr(): Promise<void> {
    await lastValueFrom(this.modalsService.open('qrScanner', 'center', {}).afterClosed());
    if (this.store.thereIsNotScannedProduct()) return;
    this.search.patchValue(this.store.scannedProduct(), { emitEvent: false });
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filtersApplied = {
      packagingTypeId: this.packagingTypeId.value,
      productFormatId: this.productFormatId.value,
      categoryId: this.categoryId.value,
      search: this.search.value
    };
    this.filtersHasChanged.emit(this.filtersApplied);
  }

  private control(nombre: string): AbstractControl {
    return this.form.get(nombre)!;
  }
  //#endregion

  //#endregion Getters
  public get productFormatId() {
    return this.control('productFormatId');
  }
  public get packagingTypeId() {
    return this.control('packagingTypeId');
  }
  public get categoryId() {
    return this.control('categoryId');
  }
  public get search() {
    return this.control('search');
  }
  //#endregion
}
