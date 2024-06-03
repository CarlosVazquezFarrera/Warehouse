import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { DashboardStore } from '@store/dashboard.store';
import { AutoCompleteFieldComponent } from '@shared/controls/auto-complete-field/auto-complete-field.component';

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
  async ngOnInit(): Promise<void> {
    await this.store.loadMissingProductFromAirPort();
  }

  public store = inject(DashboardStore);
  private fb = inject(FormBuilder);

  public data = [this.store.missingProduct()]

  public form = this.fb.group({
    product: ['', Validators.required],
    quantity: ['', Validators.required]
  });

  public save(): void {
    console.log(this.form.controls)
  }


}
