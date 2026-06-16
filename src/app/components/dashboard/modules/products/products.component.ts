import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { environment } from '@environments/environment';
import { ProductSearch } from '@models/requestParams/productSearch';
import { ModalsService } from '@services/modals.service';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { ProductFiltersComponent } from '@shared/components/product-filters/product-filters.component';
import { MaterialModule } from '@shared/modules/material.module';
import { WarehouseStore } from '@store/warehouse.store';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MaterialModule,
    NoDataComponent,
    ProductFiltersComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  //#region Properties
  public store = inject(WarehouseStore);
  private modalsService = inject(ModalsService);

  public displayedColumns: string[] = ['name', 'supplierPart', 'category', 'packagingType', 'presentation', 'presentationQuantity', 'productFormat', 'formatQuantity'];
  public pageSize!: number;
  //#endregion

  //#region Methods

  async ngOnInit() {
    this.store.getPackagingTypes();
    this.store.getProductFormats();
    this.store.getCategories();
    await this.store.getPagedProducts();
  }
  ngOnDestroy(): void {
    this.store.cleanProductPageSize();
    this.store.cleanProductFilter();
  }
  public filtersHasChanged(filters: ProductSearch): void {
    this.store.setProductFilter(filters)
    this.store.searchProducts(1)
  }

  public productClicked(productId: string): void {
    this.store.setSelectedProduct(productId);
    this.modalsService.open('product');
  }

  public addProducts(): void {
    this.modalsService.open('product');
  }
  public handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    this.store.setProductPageSize(pageSize);
    this.store.searchProducts(e.pageIndex + 1);
  }
  //#endregion
}
