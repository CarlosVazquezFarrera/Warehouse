import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { PageEvent } from '@angular/material/paginator';
import { Product } from '@models/DTO/product';
import { ModalsService } from '@services/modals.service';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { DebounceTimeSearchFieldComponent } from '@shared/controls/debounce-time-search-field/debounce-time-search-field.component';
import { MaterialModule } from '@shared/modules/material.module';
import { EgressStore } from '@store/egress.store';

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
export class SelectProductsComponent implements OnInit {
  public store = inject(EgressStore);
  private fb = inject(FormBuilder);
  public displayedColumns: string[] = ['product','stock', 'select'];
  private modalsService = inject(ModalsService);

  public form = this.fb.group({
    search: ['']
  });

  //#region Methods

  async ngOnInit(): Promise<void> {
    await this.store.getPagedProducts();
    this.search.valueChanges.subscribe(_ => this.loadProducts())
  }

  private async loadProducts(pageNumber?: number, pageSize?: number): Promise<void> {
    await this.store.getPagedProducts(pageNumber, pageSize, this.search.value,);
  }

  public async handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    const pageNumber = e.pageIndex + 1;
    await this.loadProducts(pageNumber, pageSize)
  }

  public selectionChange(option: MatCheckbox, product: Product): void {
    if (option.checked)
      this.store.addProduct(product);
    else
      this.store.removeProduct(product);
  }


  public save() {
    this.modalsService.closeModal();
  }

  //#endregion

  //#region Gets
  public get search(): AbstractControl {
    return this.form.get('search')!;
  }
  //#endregion
}
