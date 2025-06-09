import { Component, OnInit, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { DashboardStore } from '@store/dashboard.store';
import { ModalsService } from '@services/modals.service';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { MaterialModule } from '@shared/modules/material.module';
import { Product } from '@models/DTO/product';
import { CompleteStockPipe } from '@shared/pipes/complete-stock.pipe';
import { CommonModule } from '@angular/common';
import { ProductFiltersComponent } from '@shared/components/product-filters/product-filters.component';
import { Filters } from '@models/custom/filters';
import { environment } from '@environments/environment';

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
export class InventoryComponent implements OnInit {
  //#region Methods
  async ngOnInit(): Promise<void> {
    this.store.loadPackagingTypes();
    this.store.loadProductFormats();
    this.store.loadCategories();
    await this.store.loadProducts();
  }
  //#endregion

  //#region Properties
  public store = inject(DashboardStore);
  private modalsService = inject(ModalsService);
  public displayedColumns: string[] = ['name', 'supplierPart', 'category', 'productFormat', 'completeStock', 'stock'];
  public filters!: Filters;
  public pageNumber!: number;
  public pageSize!: number;
  //#endregion

  //#region Methods
  public productClicked(product: Product): void {
    this.store.setSelectedProduct(product);
    this.modalsService.showLateralModal('movements');
  }

  public filtersHasChanged(filters: Filters): void {
    this.filters = filters;
    this.pageNumber = environment.pagination.defaultPageNumber;

    this.searchProducts();
  }

  private searchProducts() {
    const { search, categoryId, productFormatId, packagingTypeId } = this.filters ?? {};
    this.store.searchProduct(this.pageNumber, this.pageSize, search, categoryId, productFormatId, packagingTypeId);
  }

  public handlePageEvent(e: PageEvent) {
    const { pageSize, pageIndex } = e;
    this.pageNumber = pageIndex + 1;
    this.pageSize = pageSize;
    this.searchProducts();
  }

  public createOrder(): void {
    this.modalsService.showLateralModal('create-egress');
  }
  //#endregion
}
