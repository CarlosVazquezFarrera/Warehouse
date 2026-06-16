import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ModalsService } from '@services/modals.service';
import * as json from './products-metadata.json';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';
import { FormModule } from '@shared/modules/form.module';
import { MaterialModule } from '@shared/modules/material.module';
import { merge } from 'rxjs';
import { cleanString } from '@shared/helper/string';
import { WarehouseStore } from '@store/warehouse.store';
import { ProductDto } from '@models/Dto/productDto';
import { Product } from '@models/types/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    FormModule,
    MaterialModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit, OnDestroy {
  constructor() {
    ErrorMessageHandle(this.presentationQuantity, this.errorPresentationQuantity, this.jsonErrors.errors.presentationQuantity);
    ErrorMessageHandle(this.name, this.errorsName, this.jsonErrors.errors.name);
    ErrorMessageHandle(this.formatQuantity, this.errorFormatQuantity, this.jsonErrors.errors.formatQuantity);
    ErrorMessageHandle(this.supplierPart, this.errorSupplierPart, this.jsonErrors.errors.supplierPart)
  }

  ngOnInit(): void {
    this.store.getPackagingTypes();
    this.store.getPresentations();
    this.store.getProductFormats();
    this.store.getCategories();
    this.disablePresentationQuantityIfSingle();
    this.presentationId.valueChanges.subscribe(_ => this.presentationIdHasChanged());
    merge(
      this.presentationQuantity.valueChanges,
      this.formatQuantity.valueChanges)
      .subscribe(_ => this.formatOrPresentationHasChange());
  }

  ngOnDestroy(): void {
    this.store.resetSelectedProduct();
  }

  // #region Properties
  public store = inject(WarehouseStore);
  private fb = inject(FormBuilder);
  private modalService = inject(ModalsService);
  private jsonErrors = json;

  public errorPresentationQuantity = signal(this.jsonErrors.errors.presentationQuantity.required);
  public errorFormatQuantity = signal(this.jsonErrors.errors.formatQuantity.required);
  public errorsName = signal(this.jsonErrors.errors.name.required);
  public errorSupplierPart = signal(this.jsonErrors.errors.supplierPart.required);


  public form = this.fb.group({
    name: [this.store.selectedProduct()?.name ?? '', Validators.required],
    supplierPart: [this.store.selectedProduct()?.supplierPart ?? '', Validators.required],
    packagingTypeId: [this.store.selectedProduct()?.packagingTypeId ?? '', Validators.required],
    presentationId: [this.store.selectedProduct()?.presentationId ?? '', Validators.required],
    productFormatId: [this.store.selectedProduct()?.productFormatId ?? '', Validators.required],
    presentationQuantity: [this.store.selectedProduct()?.presentationQuantity ?? '', [Validators.required, Validators.min(1)]],
    formatQuantity: [this.store.selectedProduct()?.formatQuantity ?? '', [Validators.required, Validators.min(1)]],
    categoryId: [this.store.selectedProduct()?.categoryId ?? '', Validators.required],
    stock: [{ value: this.store.selectedProduct()?.stock ?? 0, disabled: true }],
  });

  // #endregion


  // #region Methods

  public disablePresentationQuantityIfSingle() {
    if (!this.store.selectedProduct()?.presentationId) return;

    if (this.store.selectedProduct()?.presentationName?.toLowerCase() !== "single") return
    this.presentationQuantity.disable();
  }
  private control(name: string): AbstractControl {
    return this.form.get(name)!;
  }

  public async save(): Promise<void> {
    if (this.form.invalid) return;
    await this.store.createProduct(this.newProduct);
    this.modalService.close();
  }

  public async update(): Promise<void> {
    if (this.form.invalid) return;
    await this.store.updateProduct(this.product);
    this.modalService.close();
  }

  private presentationIdHasChanged(): void {
    const presentation = this.store.presentations().find(p => p.id == this.presentationId.value)!;
    if (presentation.name.toLowerCase() == "single") {
      this.presentationQuantity.disable();
      this.presentationQuantity.setValue(1);
    }
    else {
      this.presentationQuantity.enable();
      this.presentationQuantity.removeValidators(Validators.min(1));
      this.presentationQuantity.addValidators(Validators.min(2));
      this.presentationQuantity.updateValueAndValidity();
      this.presentationQuantity.setValue(null);
    }
  }

  private formatOrPresentationHasChange() {
    const total = this.formatQuantityValue * this.presentationQuantityValue;
    this.stock.setValue(total);
  }
  // #endregion

  //#region  Gets
  public get name(): AbstractControl {
    return this.control('name');
  }
  public get supplierPart(): AbstractControl {
    return this.control('supplierPart');
  }
  public get presentationQuantity(): AbstractControl {
    return this.control('presentationQuantity');
  }
  private get presentationQuantityValue(): number {
    const value = this.presentationQuantity.value;
    if (!value) return 0;
    return Number(value);
  }
  public get formatQuantity(): AbstractControl {
    return this.control('formatQuantity');
  }
  public get formatQuantityValue(): number {
    const value = this.formatQuantity.value;
    if (!value) return 0;
    return Number(value);
  }
  public get presentationId(): AbstractControl {
    return this.control('presentationId');
  }
  public get stock(): AbstractControl {
    return this.control('stock');
  }

  public get packagingTypeId(): AbstractControl {
    return this.control('packagingTypeId');
  }
  public get productFormatId(): AbstractControl {
    return this.control('productFormatId');
  }
  public get categoryId(): AbstractControl {
    return this.control('categoryId');
  }
  private get newProduct(): Product {
    return {
      name: cleanString(`${this.name.value}`),
      supplierPart: cleanString(`${this.supplierPart.value}`),
      packagingTypeId: this.packagingTypeId.value,
      categoryId: this.categoryId.value,
      presentationId: this.presentationId.value,
      presentationQuantity: this.presentationQuantity.value,
      productFormatId: this.productFormatId.value,
      formatQuantity: this.formatQuantity.value,
      stock: 0
    }
  }

  private get product(): ProductDto {
    const product: ProductDto = {
      ...this.newProduct,
      id: this.store.selectedProduct()!.id,
      packagingTypeName: this.store.packagingTypes().find(p => p.id == this.packagingTypeId.value)?.name!,
      productFormatName: this.store.productFormats().find(p => p.id == this.productFormatId.value)?.name!,
      presentationName: this.store.presentations().find(p => p.id == this.presentationId.value)?.name!,
      categoryName: this.store.categories().find(c => c.id == this.categoryId.value)?.name!,
      stock: this.store.selectedProduct()!.stock,
      airportId: this.store.selectedProduct()!.airportId,
    }
    return product;
  }
  // #endregion

}
