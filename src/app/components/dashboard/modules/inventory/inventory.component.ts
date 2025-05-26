import { AfterContentInit, Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DashboardStore } from '@store/dashboard.store';
import { ModalsService } from '@services/modals.service';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { environment } from '@environments/environment';
import { debounceTime, lastValueFrom, merge } from 'rxjs';
import { MaterialModule } from '@shared/modules/material.module';
import { Product } from '@models/DTO/product';
import { CompleteStockPipe } from '@shared/pipes/complete-stock.pipe';
import { fadeInOut } from '@shared/animations/fadeInOut';
import { bounce } from '@shared/animations/bounce';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  animations: [fadeInOut, bounce],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    NoDataComponent,
    CompleteStockPipe],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit, AfterContentInit {
  //#region Methods
  async ngOnInit(): Promise<void> {
    this.store.loadPackagingTypes();
    this.store.loadProductFormats();
    this.store.loadCategories();
    await this.store.loadProducts();
  }

  ngAfterContentInit() {
    this.search.valueChanges
      .pipe(
        debounceTime(environment.defaultDebounceTime)
      )
      .subscribe(() => this.searchProducts());

    merge(
      this.pacakagingTypeId.valueChanges,
      this.productFormatId.valueChanges,
      this.categoryId.valueChanges,
    ).subscribe(() => this.searchProducts());

  }
  //#endregion

  //#region Properties
  public store = inject(DashboardStore);
  private fb = inject(FormBuilder);
  private modalsService = inject(ModalsService);
  public showFilters = false;

  public displayedColumns: string[] = ['name', 'supplierPart', 'category', 'productFormat', 'completeStock', 'stock'];
  public form = this.fb.group({
    search: [''],
    pacakagingTypeId: [null],
    productFormatId: [null],
    categoryId: [null]
  });
  public search = this.control('search');
  public productFormatId = this.control('productFormatId');
  public pacakagingTypeId = this.control('pacakagingTypeId');
  public categoryId = this.control('categoryId');
  //#endregion

  //#region Methods
  public productClicked(product: Product): void {
    this.store.setSelectedProduct(product);
    this.modalsService.showLateralModal('movements');
  }
  public clearSearch(): void {
    this.search.patchValue('');
  }
  public clearPackagingType(event: Event): void {
    event.stopPropagation();
    this.pacakagingTypeId.patchValue('');
  }

  public clearProductFormat(event: Event): void {
    event.stopPropagation();
    this.productFormatId.patchValue('');
  }

  public clearCategory(event: Event): void {
    event.stopPropagation();
    this.categoryId.patchValue('');
  }

  public clearFilters(): void {
    this.pacakagingTypeId.patchValue('', { emitEvent: false });
    this.productFormatId.patchValue('', { emitEvent: false });
    this.categoryId.patchValue('', { emitEvent: false });
    this.searchProducts();
  }

  public async scanQr(): Promise<void> {
    await lastValueFrom(this.modalsService.showModal('qrScanner').afterClosed());
    if (this.store.thereIsNotProductScanned()) return;
    this.search.patchValue(this.store.productNameScanned());
  }

  private async searchProducts(pageNumber?: number, pageSize?: number): Promise<void> {
    await this.store.searchProduct(pageNumber, pageSize, this.search.value, this.categoryId.value, this.productFormatId.value, this.pacakagingTypeId.value);
  }

  public async handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    const pageNumber = e.pageIndex + 1;
    await this.searchProducts(pageNumber, pageSize);
  }

  public createOrder(): void {
    this.modalsService.showLateralModal('create-egress');
  }

  public toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  private control(nombre: string): AbstractControl {
    return this.form.get(nombre)!;
  }
  //#endregion
}
