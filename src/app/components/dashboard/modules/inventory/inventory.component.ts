import { AfterContentInit, Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DashboardStore } from '@store/dashboard.store';
import { ModalsService } from '@services/modals.service';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { environment } from '@environments/environment';
import { debounceTime, lastValueFrom } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '@shared/modules/material.module';
import { Product } from '@models/DTO/product';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MaterialModule,
    ReactiveFormsModule,
    NoDataComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit, AfterContentInit {
  //#region Hooks
  async ngOnInit(): Promise<void> {
    await this.store.loadProducts();
    await this.handleSupplyGotByURL();
  }

  ngAfterContentInit() {
    this.search.valueChanges.pipe(debounceTime(environment.defaultDebounceTime)).subscribe(() => {
      this.store.searchProduct(this.search.value);
    });
  }
  //#endregion

  //#region Properties
  public store = inject(DashboardStore);
  private fb = inject(FormBuilder);
  private modalsService = inject(ModalsService);
  private route = inject(ActivatedRoute);

  public displayedColumns: string[] = ['name', 'supplierPart', 'presentation', 'productFormat', 'stock'];
  public form = this.fb.group({
    search: ['']
  });
  //#endregion

  //#region Methods
  public productClicked(product: Product): void {
    this.store.setSelectedProduct(product);
    this.store.setProductIdToNewEgress();
    this.modalsService.showLateralModal('movements');
  }
  public clearSearch(): void {
    this.search.patchValue('');
  }

  public async scanQr(): Promise<void> {
    await lastValueFrom(this.modalsService.showModal('qrScanner').afterClosed());
    if (this.store.idSupplyScanned() === '') return;
    //await this.store.loadSupply();
    this.store.clearIdSupplyScanned();
    this.modalsService.showLateralModal('movements');
  }
  public async handlePageEvent(e: PageEvent) {
    const { pageSize } = e;
    const pageNumber = e.pageIndex + 1;
    await this.store.searchProduct(this.search.value, pageNumber, pageSize);
  }

  private async handleSupplyGotByURL(): Promise<void> {
    const idSupply = this.route.snapshot.paramMap.get('idSupply');

    if (!idSupply) return;
    //if (this.store.prod.id() == '') return;

    this.modalsService.showLateralModal('movements');
  }
  public addProduct(): void {
    this.modalsService.showLateralModal('products');
  }
  //#endregion

  //#region Gets
  public get search(): AbstractControl {
    return this.form.get('search')!;
  }
  //#endregion
}
