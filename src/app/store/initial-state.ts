import { inject, InjectionToken } from "@angular/core";
import { environment } from "@environments/environment";
import { SessionService } from "@services/session.service";
import { AgentDto } from "../models/Dto/agentDto";
import { PackagingTypeDto } from "../models/Dto/packagingTypeDto";
import { ProductFormatDto } from "../models/Dto/productFormatDto";
import { PagedResult } from "../models/custom/pagedResult";
import { ProductDto } from "../models/Dto/productDto";
import { SelectableProduct } from "../models/custom/selectableProduct";
import { ProductSearch } from "../models/requestParams/productSearch";
import { PresentationDto } from "../models/Dto/presentationDto";
import { DepartmentDto } from "../models/Dto/departmentDto";

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
  filtersProduct: ProductSearch,
  filtersSelectProduct: ProductSearch,
  presentations: PresentationDto[],
  deparments: DepartmentDto[],
  selectedProductIds: Set<string>,
  lastProductAdded: ProductDto | null,
  lastProductRemoved: ProductDto | null,
}

const initialPagedProducts: PagedResult<ProductDto> = {
  data: [],
  page: 0,
  pageSize: 0,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false
}

const initialSelectableProduct: PagedResult<SelectableProduct> = {
  data: [],
  page: 0,
  pageSize: 0,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false
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
        lastProductRemoved: null
      }
      return loggedInState;
    }
    return initialState
  },
});
