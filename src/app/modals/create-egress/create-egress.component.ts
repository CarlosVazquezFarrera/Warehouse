import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, effect, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { MaterialModule } from '@shared/modules/material.module';
import { AutoCompleteFieldComponent } from '@shared/controls/auto-complete-field/auto-complete-field.component';
import { ModalsService } from '@services/modals.service';
import { EgressStore } from '@store/egress.store';
import { Product } from '@models/DTO/product';
import * as json from './create-egress-metadata.json';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';
import { DatePipe } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { WarehouseStore } from '@store/warehouse.store';
import { NewEgress } from '@models/types/newEgress';
import { DashboardStore } from '@store/dashboard.store';


@Component({
  selector: 'app-create-egress',
  standalone: true,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  imports: [ModalHeaderComponent,
    MaterialModule,
    AutoCompleteFieldComponent,
    DatePipe
  ],
  templateUrl: './create-egress.component.html',
  styleUrl: './create-egress.component.scss'
})
export class CreateEgressComponent implements OnInit, OnDestroy {
  constructor() {
    ErrorMessageHandle(this.count, this.errorCount, json.errors.count);

    effect(() => {
      const product = this.store.lastProductAdded();
      if (!product || this.productsIdSelected.has(product.id)) return;
      this.addProductToArray(product);
    });

    effect(() => {
      const product = this.store.lastProductRemoved();

      if (!product) return;
      this.productHasBeenRemoved(product);
    });
  }

  //#region Properties


  public now = new Date();
  public errorCount = signal(json.errors.count.min);

  public tooltipFinal = json.tooltip.final;
  public store = inject(EgressStore);
  public bashBoardStore = inject(DashboardStore); 
  public warehouseStore = inject(WarehouseStore);

  public accordion = viewChild.required(MatAccordion);
  public stepper = viewChild.required(MatStepper);

  public displayedColumns: string[] = ['product', 'quantity'];
  private modalsService = inject(ModalsService);
  private productsIdSelected = new Set<string>();
  private fb = inject(FormBuilder);

  public departmentForm = this.fb.group({
    departmentId: ['', Validators.required]
  });

  public productsForm = this.fb.group({
    count: [0, Validators.min(1)],
    products: this.fb.array([])
  });
  //#endregion

  //#region Methods
  public async ngOnInit(): Promise<void> {
    await this.store.getDepartments();
    this.departmentId.valueChanges.subscribe(deparmentId => {
      this.store.setDepartmentId(deparmentId);
    });
  }
  public ngOnDestroy(): void {
    this.store.clearEgress();
  }

  public goFromDepartmentToProduct(): void {
    this.stepper().next();
  }
  public goFromProductToFinal() {
    if (this.productsForm.valid) { }
    this.stepper().next();
  }
  public goBack() {
    this.stepper().previous();
  }

  public addProducts(): void {
    this.modalsService.showModal('select-products')
  }

  private addProductToArray(product: Product): void {
    this.productsIdSelected.add(product.id);
    const control = this.fb.group({
      id: [product.id],
      name: [product.name],
      stock: [product.stock],
      supplierPart: [product.supplierPart],
      quantity: ['', [Validators.required, Validators.max(product.stock), Validators.min(1)]],
    });
    this.products.push(control);
    this.count.setValue(this.productsIdSelected.size)
  }

  private productHasBeenRemoved(product: Product): void {
    const index = this.productsIdArray.findIndex(p => p === product.id);
    if (index < 0) return;
    this.removeFromSetAndArray(product.id, index);
  }

  public deleteProduct(event: Event, index: number, productId: string) {
    event.stopPropagation();
    this.store.removeProducrById(productId);
    this.removeFromSetAndArray(productId, index);
  }

  private removeFromSetAndArray(productId: string, index: number) {
    this.productsIdSelected.delete(productId);
    this.products.removeAt(index);
    this.count.setValue(this.productsIdSelected.size);
  }

  public quantityControl(index: number): FormControl {
    const form = this.products.at(index) as FormGroup;
    return form.get('quantity') as FormControl;
  }

  public async createOrden(): Promise<void> {
    if (this.formsInvalid) return;
    await this.bashBoardStore.createEgressOrder(this.newEgress);
    this.modalsService.closeModal();
  }
  //#endregion

  //#region Gets
  public get newEgress(): Array<NewEgress> {
    const productEgress = this.products.controls.map((control: AbstractControl) => {
      const product: NewEgress = {
        amountRemoved: control.get('quantity')!.value as number,
        productId: control.get('id')!.value,
        departmentId: this.store.requestingDepartment()!
      }
      return product;
    });
    return productEgress;
  }

  private get departmentId(): AbstractControl {
    return this.departmentForm.get('departmentId')!;
  }
  public get formsInvalid(): boolean {
    return this.productsForm.invalid || this.productsForm.invalid
  }
  private get count(): AbstractControl {
    return this.productsForm.get('count')!;
  }
  public get products(): FormArray {
    return this.productsForm.get('products')! as FormArray;
  }

  public get productControls(): Array<AbstractControl> {
    return this.products.controls;
  }

  private get productsIdArray(): Array<string> {
    return this.products.controls.map((control: AbstractControl) => {
      const productGroup = control as FormGroup;
      return productGroup.get('id')!.value;
    });
  }
  //#endregion
}
