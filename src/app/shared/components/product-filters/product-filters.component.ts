import { AfterContentInit, Component, inject, input, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { environment } from '@environments/environment';
import { Filters } from '@models/custom/filters';
import { ModalsService } from '@services/modals.service';
import { bounce } from '@shared/animations/bounce';
import { fadeInOut } from '@shared/animations/fadeInOut';
import { MaterialModule } from '@shared/modules/material.module';
import { DashboardStore } from '@store/dashboard.store';
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
  public store = inject(DashboardStore);

  private filtersApplied: Filters = {
    search: undefined,
    packagingTypeId: undefined,
    productFormatId: undefined,
    categoryId: undefined,
  };
  public filtersHasChanged = output<Filters>();

  public form = this.fb.group({
    search: [null],
    packagingTypeId: [null],
    productFormatId: [null],
    categoryId: [null]
  });
  public productFormatId = this.control('productFormatId');
  public packagingTypeId = this.control('packagingTypeId');
  public categoryId = this.control('categoryId');
  public search = this.control('search');

  public isOpened = signal<boolean>(false);
  public showFiltersButton = input<boolean>(true);
  public showScanButton = input<boolean>(true);
  private modalsService = inject(ModalsService);

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
    await lastValueFrom(this.modalsService.showModal('qrScanner').afterClosed());
    if (this.store.thereIsNotProductScanned()) return;
    this.search.patchValue(this.store.productNameScanned(), { emitEvent: false });
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

}
