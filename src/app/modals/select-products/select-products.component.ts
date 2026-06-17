import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { PageEvent } from '@angular/material/paginator';
import { ProductDto } from '@models/Dto/productDto';
import { ModalsService } from '@services/modals.service';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { DebounceTimeSearchFieldComponent } from '@shared/controls/debounce-time-search-field/debounce-time-search-field.component';
import { MaterialModule } from '@shared/modules/material.module';
import { WarehouseStore } from '@store/warehouse.store';

@Component({
  selector: 'app-select-products',
  standalone: true,
  imports: [
    MaterialModule,
    DebounceTimeSearchFieldComponent,
    NoDataComponent
  ],
  templateUrl: './select-products.component.html',
  styleUrl: './select-products.component.scss'
})
export class SelectProductsComponent implements OnInit, OnDestroy {
  public store = inject(WarehouseStore);
  private fb = inject(FormBuilder);
  public displayedColumns: string[] = ['product', 'stock', 'select'];
  private modalsService = inject(ModalsService);

  public form = this.fb.group({
    search: ['']
  });


  async ngOnInit(): Promise<void> {
    await this.store.getPagedProducts(true);
    this.search.valueChanges.subscribe(async (_) => {
      this.store.setSelectProductFilter({ search: this.search.value });
      await this.store.searchProducts(1, true);

    })
  }
  ngOnDestroy(): void {
    this.store.cleanSelectProductFilter();
  }
  //#region Methods
  public async handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    this.store.setProductPageSize(pageSize);
    await this.store.searchProducts(e.pageIndex + 1, true);
  }

  public selectionChange(option: MatCheckbox, product: ProductDto): void {
    if (option.checked)
      this.store.addProduct(product);
    else
      this.store.removeProduct(product.id, product);
  }

  public save() {
    this.modalsService.close();
  }

  //#endregion

  //#region Gets
  public get search(): AbstractControl {
    return this.form.get('search')!;
  }
  //#endregion
}
