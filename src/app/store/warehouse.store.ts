import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { SessionService } from "@services/session.service";
import { initialState, WarehouseState } from "./initial-state";
import { ProductFormatService } from "@services/http/product-format.service";
import { ProductService } from "@services/http/product.service";
import { ProductSearch } from "@models/requestParams/productSearch";
import { PresentationService } from "@services/http/presentation.service";
import { DepartmentService } from "@services/http/department.service";
import { ProductDto } from "@models/Dto/productDto";
import { CategoryService } from "@services/http/category.service";
import { PackagingTypeService } from "@services/http/packaging-type.service";
import { mapPagedAfterUpdate, mapPagedProductToSelectableProduct } from "@shared/helper/mapper";
import { LoginService } from "@services/http/login.service";
import { environment } from "@environments/environment";
import { Product } from "@models/types/product";
import { EgressService } from "@services/http/egress.service";
import { Egress } from "@models/types/egress";
import { EntryService } from "@services/http/entry.service";
import { Entry } from "@models/types/entry";


export const WarehouseStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(WarehouseState)),
  withMethods(
    (store,
      loginService = inject(LoginService),
      sessionService = inject(SessionService),
      packagingTypeService = inject(PackagingTypeService),
      productFormatService = inject(ProductFormatService),
      categoryService = inject(CategoryService),
      productService = inject(ProductService),
      presentationService = inject(PresentationService),
      departmentService = inject(DepartmentService),
      egressService = inject(EgressService),
      entryService = inject(EntryService)
    ) =>
    ({
      //#region Login
      async login(agentNumber: string, passWord: string): Promise<void> {
        const agent = await loginService.login(agentNumber, passWord);
        sessionService.login(agent)
        patchState(store, (_) => ({ agent, isLoggedIn: true }));
      },
      logOut(): void {
        patchState(store, initialState)
      },
      toggleMenu(): void {
        patchState(store, { isOpen: !store.isOpen() });
      },
      //#endregion

      //#endregion PackagingTypes
      async getPackagingTypes() {
        const packagingTypes = await packagingTypeService.getAll();
        patchState(store, { packagingTypes })
      },
      //#endregion

      //#region ProductFormats
      async getProductFormats() {
        const productFormats = await productFormatService.getAll();
        patchState(store, { productFormats })
      },
      //#endregion

      //#region Categories
      async getCategories() {
        const categories = await categoryService.getAll();
        patchState(store, { categories })
      },
      //#endregion

      //#endregion Products
      async createProduct(product: Product) {
        patchState(store, { isLoading: true })
        await productService.create(product);
        const pagedProducts = await productService.search(store.filtersProduct(), 1, store.productsPageSize());
        patchState(store, { pagedProducts, isLoading: false });
      },
      async updateProduct(product: ProductDto) {
        await productService.update(product);
        const pagedProducts = mapPagedAfterUpdate(store.pagedProducts(), product);
        patchState(store, { pagedProducts });

      },
      async getPagedProducts(isSelectionComponent: boolean = false) {
        patchState(store, { isLoading: true })
        const pagedProducts = await productService.getPaged();
        if (isSelectionComponent) {
          const selectpagedProducts = mapPagedProductToSelectableProduct(pagedProducts, store.selectedProductIds());
          patchState(store, { selectpagedProducts, isLoading: false });
        }
        else
          patchState(store, { pagedProducts, isLoading: false });
      },
      async searchProducts(pageNumber?: number, isSelectionComponent: boolean = false) {
        const pagedProducts = await productService.search(isSelectionComponent ? store.filtersSelectProduct() : store.filtersProduct(), pageNumber, store.productsPageSize());
        if (isSelectionComponent) {
          const selectpagedProducts = mapPagedProductToSelectableProduct(pagedProducts, store.selectedProductIds());
          patchState(store, { selectpagedProducts, isLoading: false });
        }
        else
          patchState(store, { pagedProducts, isLoading: false });
      },
      //#endregion
      async getPresentations() {
        const presentations = await presentationService.getAll();
        patchState(store, { presentations })
      },
      //#region Department
      async getDepartments() {
        const deparments = await departmentService.getAll();
        patchState(store, { deparments })
      },
      //#endregion
      //#region Egress
      async createListEgress(listEgress: Egress[]) {
        const processedList = await egressService.createList(listEgress);
        const egressMap = new Map(processedList.map(egress => [egress.productId, egress]));

        const updatedProducts: ProductDto[] = store.pagedProducts.data().map(product => {
          const matchingRecord = egressMap.get(product.id);
          if (matchingRecord) {
            return {
              ...product,
              stock: matchingRecord.quantityAfter!,
            }
          }
          return product;
        });
        patchState(store, {
          pagedProducts: {
            ...store.pagedProducts(),
            data: updatedProducts
          }
        });
      },
      //#endregion

      //#region Entry
      async createEntry(entry: Entry) {
        const newEntry = await entryService.create(entry);
        const updatedProducts: ProductDto[] = store.pagedProducts.data().map(product => {
          if (product.id == newEntry.productId) {
            return {
              ...product,
              stock: newEntry.quantityAfter!,
            }
          }
          return product;
        });
        patchState(store, {
          pagedProducts: {
            ...store.pagedProducts(),
            data: updatedProducts
          }
        });
      },
      //#endregion
      addProduct(product: ProductDto): void {
        const selectedProductIds = new Set([...store.selectedProductIds().values(), product.id]);
        patchState(store, { lastProductAdded: product, selectedProductIds });
      },
      removeProduct(productId: string, product?: ProductDto) {
        store.selectedProductIds().delete(productId);
        const selectedProductIds = new Set([...store.selectedProductIds().values()])
        if (product)
          patchState(store, { lastProductRemoved: product, selectedProductIds });
        else
          patchState(store, { selectedProductIds });
      },
      setProductPageSize(size: number) {
        patchState(store, { productsPageSize: size });
      },
      cleanProductPageSize() {
        patchState(store, { productsPageSize: environment.pagination.defaultPageSize });
      },
      cleanProductFilter() {
        patchState(store, { filtersProduct: {} });
      },
      setProductFilter(filters: ProductSearch) {
        patchState(store, { filtersProduct: filters });
      },
      cleanSelectProductFilter() {
        patchState(store, { filtersSelectProduct: {} });
      },
      setSelectProductFilter(filters: ProductSearch) {
        patchState(store, { filtersSelectProduct: filters });
      },
      resetScannedProduct() {
        patchState(store, { scannedProduct: '' })
      },
      setScannedProduct(id: string) {
        patchState(store, { scannedProduct: id })
      },
      setSelectedProduct(id: string) {
        patchState(store, { selectedProductId: id })
      },
      resetSelectedProduct() {
        patchState(store, { selectedProductId: '' })
      },
      resetEgress() {
        patchState(store, {
          selectedProductIds: new Set(),
          lastProductAdded: null,
          lastProductRemoved: null,
        });
      }
    })
  ),
  withComputed(({ agent, pagedProducts, selectedProductId, scannedProduct, selectpagedProducts, selectedProductIds }) => ({
    fullName: computed(() => `${agent().name} ${agent().lastName}`),
    productsHaveData: computed(() => pagedProducts.data().length > 0),
    selectProductsHaveData: computed(() => selectpagedProducts.data().length > 0),
    selectedProduct: computed(() => pagedProducts.data().find(p => p.id == selectedProductId())),
    thereIsNotScannedProduct: computed(() => scannedProduct() === ''),
    thereAreSelectedProducts: computed(() => selectedProductIds().size > 0)
  }))
);
