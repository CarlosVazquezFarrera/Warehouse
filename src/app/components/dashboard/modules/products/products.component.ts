import { Component, inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { environment } from '@environments/environment';
import { Filters } from '@models/custom/filters';
import { Product } from '@models/DTO/product';
import { ModalsService } from '@services/modals.service';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { ProductFiltersComponent } from '@shared/components/product-filters/product-filters.component';
import { MaterialModule } from '@shared/modules/material.module';
import { DashboardStore } from '@store/dashboard.store';

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
export class ProductsComponent implements OnInit {
  //#region Properties
  public store = inject(DashboardStore);
  private modalsService = inject(ModalsService);

  public displayedColumns: string[] = ['name', 'supplierPart', 'category', 'packagingType', 'presentation', 'presentationQuantity', 'productFormat', 'formatQuantity'];
  public filters!: Filters;
  public pageNumber!: number;
  public pageSize!: number;
  //#endregion

  //#region Methods

  async ngOnInit() {
    await this.store.loadProducts();
  }
  public filtersHasChanged(filters: Filters): void {
    this.filters = filters;
    this.searchProducts();
  }

  public productClicked(product: Product): void {
    this.store.setSelectedProduct(product);
    this.modalsService.showLateralModal('products');
  }

  public addProducts(): void {
    this.modalsService.showLateralModal('products');
  }

  private searchProducts() {
    this.pageNumber = environment.pagination.defaultPageNumber;
    const { search, categoryId, productFormatId, packagingTypeId } = this.filters ?? {};
    this.store.searchProduct(this.pageNumber, this.pageSize, search, categoryId, productFormatId, packagingTypeId);
  }

  public handlePageEvent(e: PageEvent) {
    const { pageSize, pageIndex } = e;
    this.pageNumber = pageIndex + 1;
    this.pageSize = pageSize;
    this.searchProducts();
  }
  //#endregion
}
