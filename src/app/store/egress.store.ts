import { computed, inject } from "@angular/core";
import { PagedResponse } from "@models/custom/pagedResonse";
import { SelectableProducts } from "@models/custom/selectableProducts";
import { Department } from "@models/DTO/department";
import { Product } from "@models/DTO/product";
import { NewEgress } from "@models/types/newEgress";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { DepartmentService } from "@services/department.service";
import { EgressService } from "@services/egress.service";
import { ProductService } from "@services/product.service";

type Egress = {
    departments: Array<Department>;
    requestingDepartment: string | null;
    pagedProducts: PagedResponse<SelectableProducts>,
    productIdsSelected: Set<string>,
    lastProductAdded: Product | null,
    lastProductRemoved: Product | null,
    newEgress: NewEgress | null;
}
const initialState: Egress = {
    departments: [],
    pagedProducts: {
        data: [],
        metadata: {
            totalCount: 0,
            pageSize: 0,
            currentPage: 0,
            totalPages: 0,
            hasPreviousPage: false,
            hasNextPage: false
        }
    },
    productIdsSelected: new Set(),
    lastProductAdded: null,
    lastProductRemoved: null,
    requestingDepartment: null,
    newEgress: null
}

export const EgressStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((
        store,
        departmentService = inject(DepartmentService),
        productService = inject(ProductService),
        egressService = inject(EgressService)      
    ) => ({
        async getPagedProducts(pageNumber?: number, pageSize?: number, search?: string) {
            const products = await productService.getPagedWithSearch(search, pageNumber, pageSize, 'GetProductsPagedByAirport');
            const pagedProducts = {
                ...products,
                data: products.data.map(product => {

                    const SelectableProduct: SelectableProducts = {
                        ...product,
                        isSelected: store.productIdsSelected().has(product.id)
                    }
                    return SelectableProduct
                })
            };
            patchState(store, { pagedProducts });

        },
        async getDepartments(): Promise<void> {
            const departments = await departmentService.getAll();
            patchState(store, { departments })
        },
        addProduct(product: Product): void {
            const productIdsSelected = new Set([...store.productIdsSelected().values(), product.id]);
            patchState(store, (state) => ({
                ...state,
                lastProductAdded: product,
                productIdsSelected,
            }));
        },
        removeProduct(product: Product) {
            store.productIdsSelected().delete(product.id);
            const productIdsSelected = new Set([...store.productIdsSelected().values()])
            patchState(store, (state) => ({
                ...state,
                lastProductRemoved: product,
                productIdsSelected
            }));
        },
        removeProducrById(productId: string) {
            store.productIdsSelected().delete(productId);
            const productIdsSelected = new Set([...store.productIdsSelected().values()]);
            patchState(store, { productIdsSelected });
        },
        setDepartmentId(requestingDepartment: string) {
            patchState(store, { requestingDepartment })
        },
        clearEgress() {
            patchState(store, { ...initialState })
        }
    })),
    withComputed(({ productIdsSelected, departments, requestingDepartment }) => ({
        thereAreProductsSelected: computed(() => {
            return productIdsSelected().size > 0
        }),
        department: computed(() => {
            return departments().find(d => d.id === requestingDepartment());
        })
    }))
)