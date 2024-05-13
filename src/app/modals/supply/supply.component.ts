import { Component, OnDestroy, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';
import * as json from './supply-metadata.json';
import { DashboardStore } from '@store/dashboard.store';
import { ModalsService } from '@services/modals.service';
import { CommonModule } from '@angular/common';
import { Product } from '@models/DTO/product';

@Component({
  selector: 'app-supply',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ModalHeaderComponent, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTooltipModule],
  templateUrl: './supply.component.html',
  styleUrl: './supply.component.scss'
})
export class SupplyComponent implements OnDestroy {
  constructor() {
    ErrorMessageHandle(this.name, this.errorsName, json.errors.name);
    ErrorMessageHandle(this.supplierPart, this.errorSupplierPart, json.errors.supplierPart);
  }

  //#region Properties
  public store = inject(DashboardStore);
  private modalService = inject(ModalsService);
  private fb = inject(FormBuilder);
  public form = this.fb.group({
    name: [this.store.selectedProduct.name() ?? '', [Validators.required, Validators.minLength(2)]],
    supplierPart: [this.store.selectedProduct.supplierPart() ?? '', [Validators.required, Validators.minLength(2)]]
  });
  public errorsName = signal(json.errors.name.required);
  public errorSupplierPart = signal(json.errors.supplierPart.required);
  //#endregion


  //#region Methods
  ngOnDestroy(): void {
    this.store.resetSelectedProduct();
  }
  public async create(): Promise<void> {
    if (this.form.invalid) return;
    await this.store.createNewProduct(this.name.value, this.supplierPart.value);
    this.modalService.closeModal();
  }

  public async update(): Promise<void> {
    if (this.form.invalid || this.sameData) return;
    const oldProduct: Product = {
      id: this.store.selectedProduct.id(),
      name: this.name.value,
      supplierPart: this.supplierPart.value
    };
    await this.store.updateSelectedProduct(oldProduct);
    this.modalService.closeModal();
  }
  //#region

  //#region Gets
  public get name(): AbstractControl {
    return this.form.get('name')!;
  }
  public get supplierPart(): AbstractControl {
    return this.form.get('supplierPart')!;
  }
  public get sameData(): boolean {
    return this.store.selectedProduct.name() === this.name.value &&
      this.store.selectedProduct.supplierPart() === this.supplierPart.value
  }
  //#endregion
}
