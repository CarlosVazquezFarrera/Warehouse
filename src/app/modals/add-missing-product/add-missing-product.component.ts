import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { DashboardStore } from '@store/dashboard.store';
import { AutoCompleteFieldComponent } from '@shared/controls/auto-complete-field/auto-complete-field.component';
import { NewProductLinked } from '@models/types/newProductLinked';
import { ModalsService } from '@services/modals.service';
import * as json from './add-missing-product.json';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';

@Component({
  selector: 'app-add-missing-product',
  standalone: true,
  imports: [ModalHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    AutoCompleteFieldComponent
  ],
  templateUrl: './add-missing-product.component.html',
  styleUrl: './add-missing-product.component.scss'
})
export class AddMissingProductComponent implements OnInit {
  constructor() {
    ErrorMessageHandle(this.quantity, this.errorQuantity, this.jsonErrors.errors.quantity)

    
  }
  async ngOnInit(): Promise<void> {
    await this.store.loadMissingProductFromAirPort();
  }

  public store = inject(DashboardStore);
  private fb = inject(FormBuilder);
  private modalService = inject(ModalsService);
  public jsonErrors = json;
  public errorQuantity = signal(this.jsonErrors.errors.quantity.required);

  public data = [this.store.missingProduct()]

  public form = this.fb.group({
    product: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.min(1)]]
  });

  public async save(): Promise<void> {
    if (this.form.invalid) return;
    const data: NewProductLinked = {
      productId: this.product.value,
      currentQuantity: this.quantity.value
    }

    await this.store.createNewProductLinked(data);
    this.modalService.closeModal();
  }
  private get product(): AbstractControl {
    return this.form.get('product')!;
  }
  private get quantity(): AbstractControl {
    return this.form.get('quantity')!;
  }

}
