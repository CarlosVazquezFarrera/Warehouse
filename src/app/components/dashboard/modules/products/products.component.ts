import { Component, inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Product } from '@models/DTO/product';
import { ModalsService } from '@services/modals.service';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { MaterialModule } from '@shared/modules/material.module';
import { DashboardStore } from '@store/dashboard.store';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MaterialModule,
    NoDataComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  public store = inject(DashboardStore);
  private modalsService = inject(ModalsService);
  public displayedColumns: string[] = ['name', 'supplierPart', 'category', 'packagingType', 'presentation', 'presentationQuantity', 'productFormat', 'formatQuantity'];


  async ngOnInit() {
    await this.store.loadProducts();
  }
  public productClicked(product: Product): void {
    this.store.setSelectedProduct(product);
    this.modalsService.showLateralModal('products');
  }

  public addProducts(): void {
    this.modalsService.showLateralModal('products');
  }

  public async handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    const pageNumber = e.pageIndex + 1;
    await this.store.loadProducts(pageNumber, pageSize);
  }

}
