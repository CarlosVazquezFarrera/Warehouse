import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { AgentService } from "@services/agent.service";
import { AirportService } from "@services/airport.service";
import { EntryService } from "@services/entry.service";
import { Product } from "@models/DTO/product";
import { ProductService } from "@services/product.service";
import { NewProduct } from "@models/types/newProduct";
import { NewAgent } from "@models/types/newAgent";
import { Agent } from "@models/DTO/agent";
import { PackagingType } from "@models/DTO/packagingType";
import { PackagingTypeService } from "@services/packaging-type.service";
import { Presentation } from "@models/DTO/presentation";
import { PresentationService } from "@services/presentation.service";
import { ProductFormatService } from "@services/product-format.service";
import { ProductFormat } from "@models/DTO/productFormat";
import { initialDashBoardState, initialSelectedProduct } from "./dashBoardInitialState";
import { NewEntry } from "@models/types/newEntry";
import { Entry } from "@models/DTO/entry";
import { NewEgress } from "@models/types/newEgress";
import { EgressService } from "@services/egress.service";

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialDashBoardState),
  withMethods((
    store,
    airportService = inject(AirportService),
    agentService = inject(AgentService),
    entryService = inject(EntryService),
    egressService = inject(EgressService),
    productService = inject(ProductService),
    packagingTypeService = inject(PackagingTypeService),
    presentationService = inject(PresentationService),
    productFormatService = inject(ProductFormatService),
  ) => ({
    //#region Airport
    async getAiports(): Promise<void> {
      const airports = await airportService.getAll();
      patchState(store, { airports })
    },
    //#endregion

    //#region  Products
    async loadProducts(pageNumber?: number, pageSize?: number): Promise<void> {
      const products = await productService.getPaged(pageNumber, pageSize, 'GetProductsPagedByAirport');
      patchState(store, { products });
    },
    async searchProduct(search: string, pageNumber?: number, pageSize?: number) {
      const products = await productService.getPagedWithSearch(search, pageNumber, pageSize, 'GetProductsPagedByAirport');
      patchState(store, { products });
    },
    async createNewProduct(newProduct: NewProduct): Promise<void> {
      await productService.post(newProduct);
      const products = await productService.getPaged(undefined, undefined, 'GetProductsPagedByAirport');
      patchState(store, { products });
    },
    async updateProduct(product: Product): Promise<void> {
      await productService.put(product);
      const products = store.products.data().map(p => {
        if (p.id == product.id) {
          return product;
        }
        return p;
      });

      patchState(store, (state) => ({
        products: {
          data: products,
          metadata: { ...state.products.metadata }
        }
      }));
    },
    setSelectedProduct(selectedProduct: Product): void {
      patchState(store, { selectedProduct });
    },
    resetSelectedProduct(): void {
      patchState(store, { selectedProduct: { ...initialSelectedProduct } });
    },
    async updateSelectedProduct(oldProduct: Product): Promise<void> {
      const product = await productService.put(oldProduct);
      const products = store.products.data().map(p => {
        if (p.id == product.id) {
          return product;
        }
        return p;
      });

      patchState(store, (state) => ({
        products: {
          data: products,
          metadata: { ...state.products.metadata }
        }
      }));
    },
    //#endregion 

    //#region Agents
    async getAgents(): Promise<void> {
      const agents = await agentService.getAll();
      patchState(store, { agents });
    },
    async getPagedAgents(pageNumber?: number, pageSize?: number, search?: string,): Promise<void> {
      const pagedAgents = await agentService.getPagedWithSearch(search, pageNumber, pageSize, "GetPagedAgents");
      patchState(store, { pagedAgents })
    },
    async registerNewAgent(agent: NewAgent): Promise<void> {
      await agentService.post(agent);
      const pagedAgents = await agentService.getPagedWithSearch(undefined, undefined, undefined, "GetPagedAgents");
      patchState(store, { pagedAgents })
    },

    setIdAgent(idAgent: string): void {
      patchState(store, { idAgentSelected: idAgent });
    },
    clearAgentId(): void {
      patchState(store, { idAgentSelected: '' });
    },
    async updateAgent(agent: Agent): Promise<void> {
      const updateAgent = await agentService.put(agent);

      const agents = store.pagedAgents.data().map(a => {
        if (a.id == updateAgent.id) {
          return { ...updateAgent };
        }
        return a;
      });

      patchState(store, (state) => ({
        pagedAgents: {
          data: agents,
          metadata: { ...state.pagedAgents.metadata }
        }
      }));
    },
    //#endregion


    //#endregion

    //#region Entry
    async saveNewEntry(quantityIncoming: number): Promise<void> {
      const newEntry: NewEntry = {
        productId: store.selectedProduct.id(),
        quantityIncoming
      }
      const savedEntry: Entry = await entryService.post(newEntry);
      const products = store.products.data().map(p => {
        if (p.id == newEntry.productId) {
          return { ...p, stock: savedEntry.quantityAfter };
        }
        return p;
      });

      patchState(store, (state) => ({
        products: {
          data: products,
          metadata: { ...state.products.metadata }
        }
      }));
    },
    //#endregion

    //#region PackagingType
    async loadPackagingTypes(): Promise<void> {
      const packagingTypes: Array<PackagingType> = await packagingTypeService.getAll();
      patchState(store, { packagingTypes })
    },
    //#endregion

    //#region Presentation
    async loadPresentations(): Promise<void> {
      const presentations: Array<Presentation> = await presentationService.getAll();
      patchState(store, { presentations })

    },
    //#endregion

    //#region ProductFormat 
    async loadProductFormat(): Promise<void> {
      const productFormats: Array<ProductFormat> = await productFormatService.getAll();
      patchState(store, { productFormats });
    },
    //#endregion

    //#region Egresses 
    async createEgressOrder(egresses: Array<NewEgress>): Promise<void> {
      const egressesSaved = await egressService.createEgressOrder(egresses);
      const egressMap = new Map(egressesSaved.map(egress => [egress.productId, egress]));

      const updatedProducts = store.products.data().map(product => {
        const matchingRecord = egressMap.get(product.id);
        if (matchingRecord) {
          return {
            ...product,
            stock: matchingRecord.quantityAfter,
          };
        }
        return product;
      });

      patchState(store, (state) => ({
        products: {
          data: updatedProducts,
          metadata: { ...state.products.metadata }
        }
      }));
    },
    setProductNameScanned(productNameScanned: string): void {
      patchState(store, { productNameScanned })
    },
    resetProductNameScanned(): void {
      patchState(store, { productNameScanned: '' })
    }
    //#endregion
  })),
  withComputed(({ productNameScanned, selectedProduct, pagedAgents, idAgentSelected, products }) => ({
    agentSelected: computed(() => {
      return pagedAgents.data().find(a => a.id === idAgentSelected())
    }),
    inventoryHasData: computed(() => {
      return products.data().length > 0;
    }),
    thereIsAProductSelected: computed(() => {
      return selectedProduct().id !== '';
    }),
    thereIsNotProductScanned: computed(()=> productNameScanned() === ''),
    fullNameOfTheSelectedProduct: computed(() => `${selectedProduct().name} ${selectedProduct().supplierPart}`)
  }))

);
