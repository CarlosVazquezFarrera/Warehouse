import { inject, InjectionToken } from "@angular/core";
import { environment } from "@environments/environment";
import { PagedResult } from "@models/custom/pagedResult";
import { SelectableProduct } from "@models/custom/selectableProduct";
import { TotalEgressMovementDto } from "@models/Dto/totalEgressMovementDto";
import { AgentDto } from "@models/Dto/agentDto";
import { DepartmentDto } from "@models/Dto/departmentDto";
import { EgressDto } from "@models/Dto/egressDto";
import { PackagingTypeDto } from "@models/Dto/packagingTypeDto";
import { PresentationDto } from "@models/Dto/presentationDto";
import { ProductDto } from "@models/Dto/productDto";
import { ProductFormatDto } from "@models/Dto/productFormatDto";
import { ActivityEngressParams } from "@models/requestParams/activityEngressParams";
import { LedgerEgressParams } from "@models/requestParams/ledgerEgressParams";
import { ProductParams } from "@models/requestParams/productParams";
import { SessionService } from "@services/session.service";

type Warehouse = {
  agent: AgentDto,
  isOpen: boolean,
  isLoading: boolean,
  isLoggedIn: boolean,
  packagingTypes: PackagingTypeDto[],
  productFormats: ProductFormatDto[],
  categories: ProductFormatDto[],
  pagedProducts: PagedResult<ProductDto>,
  selectpagedProducts: PagedResult<SelectableProduct>,
  selectedProductId: string,
  productsPageSize: number,
  selectProductsPageSize: number,
  scannedProduct: string,
  filtersProduct: ProductParams,
  filtersSelectProduct: ProductParams,
  presentations: PresentationDto[],
  deparments: DepartmentDto[],
  selectedProductIds: Set<string>,
  lastProductAdded: ProductDto | null,
  lastProductRemoved: ProductDto | null,
  pagesEgresses: PagedResult<EgressDto>,
  activityPagedSize: number,
  activityFilters: ActivityEngressParams | null,
  ledgerEgressMovement: PagedResult<TotalEgressMovementDto>,
  ledgerEgressMovementPageSize: number,
  ledgerEgressFilter: LedgerEgressParams | null
}

const pagedInitialState = {
  page: 0,
  pageSize: 0,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false
}

const initialPagedProducts: PagedResult<ProductDto> = {
  data: [],
  ...pagedInitialState
}

const initialPagedEgresses: PagedResult<EgressDto> = {
  data: [],
  ...pagedInitialState
}

const initialSelectableProduct: PagedResult<SelectableProduct> = {
  data: [],
  ...pagedInitialState
}

const initialTotalEgressMovement: PagedResult<TotalEgressMovementDto> = {
  data: [],
  ...pagedInitialState
}
export const initialState: Warehouse = {
  isOpen: false,
  isLoading: false,
  agent: {
    agentNumber: "",
    shortName: "",
    name: "",
    lastName: "",
    email: "",
    airportId: "",
    isActive: false,
    token: "",
    id: ""
  },
  isLoggedIn: false,
  packagingTypes: [],
  productFormats: [],
  categories: [],
  pagedProducts: initialPagedProducts,
  pagesEgresses: initialPagedEgresses,
  selectpagedProducts: initialSelectableProduct,
  selectedProductId: "",
  productsPageSize: environment.pagination.defaultPageSize,
  selectProductsPageSize: environment.pagination.defaultPageSize,
  filtersProduct: {},
  presentations: [],
  filtersSelectProduct: {},
  scannedProduct: "",
  deparments: [],
  selectedProductIds: new Set(),
  lastProductAdded: null,
  lastProductRemoved: null,
  activityPagedSize: environment.pagination.defaultPageSize,
  activityFilters: null,
  ledgerEgressMovement: initialTotalEgressMovement,
  ledgerEgressMovementPageSize: environment.pagination.defaultPageSize,
  ledgerEgressFilter: null
};

export const WarehouseState = new InjectionToken<Warehouse>('Warehouse', {
  factory: () => {
    let sessionService = inject(SessionService);
    const agent = sessionService.getAgentUser();
    if (agent) {
      const loggedInState: Warehouse = {
        isOpen: false,
        isLoading: false,
        agent,
        isLoggedIn: true,
        packagingTypes: [],
        productFormats: [],
        categories: [],
        pagedProducts: initialPagedProducts,
        pagesEgresses: initialPagedEgresses,
        selectpagedProducts: initialSelectableProduct,
        selectedProductId: "",
        productsPageSize: initialState.productsPageSize,
        selectProductsPageSize: initialState.productsPageSize,
        filtersProduct: {},
        filtersSelectProduct: {},
        presentations: [],
        scannedProduct: "",
        deparments: [],
        selectedProductIds: new Set(),
        lastProductAdded: null,
        lastProductRemoved: null,
        activityPagedSize: environment.pagination.defaultPageSize,
        activityFilters: null,
        ledgerEgressMovement: initialTotalEgressMovement,
        ledgerEgressMovementPageSize: environment.pagination.defaultPageSize,
        ledgerEgressFilter: null
      }
      return loggedInState;
    }
    return initialState
  },
});
