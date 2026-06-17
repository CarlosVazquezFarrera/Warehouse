import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';
import * as json from './entry-metadata.json';
import { WarehouseStore } from '@store/warehouse.store';
import { ModalsService } from '@services/modals.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormModule } from '@shared/modules/form.module';
import { MaterialModule } from '@shared/modules/material.module';
import { environment } from '@environments/environment';
import { EntryPipe } from '@shared/pipes/entry.pipe';
import { Entry } from '@models/types/entry';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [
    FormModule,
    MaterialModule,
    DatePipe,
    EntryPipe,
    ReactiveFormsModule,
    DecimalPipe
  ],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.scss'
})
export class EntryComponent {
  constructor() {
    ErrorMessageHandle(this.quantity, this.errorQuantity, json.errors.quantity)
  }
  //#region Properties
  public store = inject(WarehouseStore);
  public fb = inject(FormBuilder);
  private modalService = inject(ModalsService);

  public errorQuantity = signal(json.errors.quantity.required);

  public form = this.fb.group({
    quantity: ['', [Validators.required, Validators.min(1)]]
  });

  public quantity: AbstractControl = this.form.get('quantity')!;
  public now = new Date();
  //#endregion

  //#region Methods
  public async accept(): Promise<void> {
    if (this.form.invalid) return;
    const response = await this.modalService.openDialog('confirmation', environment.defaultConfirmationMessage, 'Warning');
    if (!response) return;
    await this.store.createEntry(this.entry);
    this.modalService.close();
  }
  //#endregion

  //#region Getters
  private get entry(): Entry {
    const entry: Entry = {
      productId: this.store.selectedProduct()?.id!,
      quantityIncoming: Number(this.form.get('quantity')?.value)
    }
    return entry;
  }
  //#endregion
}
