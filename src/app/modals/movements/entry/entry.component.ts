import { Component, inject, signal } from '@angular/core';
import { DashboardStore } from '@store/dashboard.store';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';
import * as json from './entry-metadata.json';
import { WarehouseStore } from '@store/warehouse.store';
import { MessageService } from '@services/message.service';
import { ModalsService } from '@services/modals.service';
import { DatePipe } from '@angular/common';
import { FormModule } from '@shared/modules/form.module';
import { MaterialModule } from '@shared/modules/material.module';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [
    FormModule,
    MaterialModule,
    DatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.scss'
})
export class EntryComponent {
  constructor() {
    ErrorMessageHandle(this.quantity, this.errorQuantity, json.errors.quantity)
  }
  //#region Properties
  public store = inject(DashboardStore);
  public warehouseStore = inject(WarehouseStore);
  public fb = inject(FormBuilder);
  private messageService = inject(MessageService);
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

    const response = await this.messageService.confirmationMessage(json.messages.acceptEntry);
    if (!response) return;

    await this.store.saveNewEntry(this.quantity.value);
    this.modalService.closeModal();
  }
  //#endregion



}
