import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import * as json from './add-supply-metadata.json';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';
import { JsonPipe } from '@angular/common';
import { DashboardStore } from '@store/dashboard.store';
import { ModalsService } from '@services/modals.service';

@Component({
  selector: 'app-add-supply',
  standalone: true,
  imports: [MatButtonModule, ModalHeaderComponent, MatFormFieldModule, ReactiveFormsModule, MatInputModule, JsonPipe],
  templateUrl: './add-supply.component.html',
  styleUrl: './add-supply.component.scss'
})
export class AddSupplyComponent {
  constructor() {
    ErrorMessageHandle(this.name, this.errorsName, json.errors.name);
    ErrorMessageHandle(this.supplierPart, this.errorSupplierPart, json.errors.supplierPart);
  }

  //#region Properties
  private store = inject(DashboardStore);
  private modalService = inject(ModalsService);
  private fb = inject(FormBuilder);
  public form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    supplierPart: ['', [Validators.required, Validators.minLength(2)]]
  });
  public errorsName = signal(json.errors.name.required);
  public errorSupplierPart= signal(json.errors.supplierPart.required);
  //#endregion


  //#region Methods
  public async create(): Promise<void> {
    if (this.form.invalid) return;
    await this.store.createNewProduct(this.name.value, this.supplierPart.value);
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
  //#endregion
}
