import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ModalsService } from '@services/modals.service';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { MaterialModule } from '@shared/modules/material.module';
import { CompleteStockPipe } from '@shared/pipes/complete-stock.pipe';
import { CommonModule } from '@angular/common';
import { ProductFiltersComponent } from '@shared/components/product-filters/product-filters.component';
import { WarehouseStore } from '@store/warehouse.store';
import { ProductSearch } from '../../../../models/requestParams/productSearch';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    NoDataComponent,
    CompleteStockPipe,
    ProductFiltersComponent
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit, OnDestroy {
  //#region Methods
  async ngOnInit(): Promise<void> {
    this.store.getPackagingTypes();
    this.store.getProductFormats();
    this.store.getCategories();
    await this.store.getPagedProducts();
  }
  ngOnDestroy(): void {
    this.store.cleanProductPageSize();
    this.store.cleanProductFilter();
  }
  //#endregion

  //#region Properties
  public store = inject(WarehouseStore);
  private modalsService = inject(ModalsService);
  public displayedColumns: string[] = ['name', 'supplierPart', 'category', 'packagingType', 'productFormat', 'completeStock', 'stock'];
  //#endregion

  //#region Methods
  public productClicked(product: string): void {
    this.store.setSelectedProduct(product);
    this.modalsService.open('movements');
  }
  public filtersHasChanged(filters: ProductSearch): void {
    this.store.setProductFilter(filters);
    this.store.searchProducts(1)
  }
  public handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    this.store.setProductPageSize(pageSize);
    this.store.searchProducts(e.pageIndex + 1);
  }

  public createOrder(): void {
    this.modalsService.open('create-egress');
  }
  //#endregion
}
