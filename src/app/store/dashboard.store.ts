import { computed, inject } from "@angular/core";
import { InventoryItem } from "@models/api/inventoryItem";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { AgentService } from "@services/agent.service";
import { AirportService } from "@services/airport.service";
import { EgressService } from "@services/egress.service";
import { InventoryService } from "@services/inventory.service";
import { NewEgress } from "@models/types/newEgress";
import { EntryService } from "@services/entry.service";
import { Product } from "@models/DTO/product";
import { ProductService } from "@services/product.service";
import { NewProduct } from "@models/types/newProduct";
import { SupplyService } from "@services/supply.service";
import { NewAgent } from "@models/types/newAgent";
import { Agent } from "@models/DTO/agent";
import { PackagingType } from "@models/DTO/packagingType";
import { PackagingTypeService } from "@services/packaging-type.service";
import { Presentation } from "@models/DTO/presentation";
import { PresentationService } from "@services/presentation.service";
import { ProductFormatService } from "@services/product-format.service";
import { ProductFormat } from "@models/DTO/productFormat";
import { initialDashBoardState, initialSelectedProduct } from "./dashBoardInitialState";
import { Egress } from "@models/DTO/egress";
import { NewEntry } from "@models/types/newEntry";
import { Entry } from "@models/DTO/entry";

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialDashBoardState),
  withMethods((store,
    airportService = inject(AirportService),
    agentService = inject(AgentService),
    egressService = inject(EgressService),
    entryService = inject(EntryService),
    productService = inject(ProductService),
    supplyService = inject(SupplyService),
    packagingTypeService = inject(PackagingTypeService),
    presentationService = inject(PresentationService),
    productFormatService = inject(ProductFormatService)
  ) => ({
    //#region Airport
    async getAiports(): Promise<void> {
      const airports = await airportService.getAll();
      patchState(store, { airports })
    },
    //#endregion

    //#region  Products
    async loadProducts(pageNumber?: number, pageSize?: number): Promise<void> {
      const products = await productService.getPaged(pageNumber, pageSize, "GetByAirport");
      patchState(store, { products });
    },
    async searchProduct(search: string, pageNumber?: number, pageSize?: number) {
      const products = await productService.getPagedWithSearch(search, pageNumber, pageSize, "GetByAirport");
      patchState(store, { products });
    },
    async createNewProduct(newProduct: NewProduct): Promise<void> {
      await productService.post(newProduct);
      const products = await productService.getPaged();
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

    setPetitionerId(petitionerId: string): void {
      const newEgress: NewEgress = { ...store.newEgress(), petitionerId }
      patchState(store, { newEgress })
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

    //#region Egress
    async saveNewEgress() {
      const neweGress = store.newEgress();
      const egress: Egress = await egressService.post(neweGress);
      const products = store.products.data().map(p => {
        if (p.id == egress.productId) {
          return { ...p, stock: egress.quantityAfter }
        }
        return p;
      });
      patchState(store, (state) => ({
        products: {
          data: products,
          metadata: { ...state.products.metadata }
        }
      }))
    },
    setProductIdToNewEgress(): void {
      patchState(store, (state) => ({
        newEgress: {
          ...state.newEgress,
          productId: store.selectedProduct().id
        }
      }))
    },

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

    //#region  Inventory
    setIdSupplyScanned(idSupplyScanned: string): void {
      patchState(store, { idSupplyScanned });
    },
    clearIdSupplyScanned(): void {
      patchState(store, { idSupplyScanned: '' })
    },
    //#endregion

    //#region  Egress
    setRemovedAmount(amountRemoved: number): void {
      const newEgress: NewEgress = { ...store.newEgress(), amountRemoved }
      patchState(store, { newEgress })
    },
    newEgressRegistered(currentQuantity: number, supplyId: string): void {
      // const data = store.inventory.data().map(i => {
      //   if (i.id == supplyId) {
      //     const newTotal = i.currentQuantity - currentQuantity;
      //     const newEgress: InventoryItem = { ...i, currentQuantity: newTotal }
      //     return newEgress;
      //   }
      //   return i;
      // });
      // patchState(store, (state) => ({
      //   inventory: {
      //     data,
      //     metadata: { ...state.inventory.metadata }
      //   }
      // }));

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
    }
    //#endregion
  })),
  withComputed(({ newEgress, agents, selectedProduct, pagedAgents, idAgentSelected, products }) => ({
    petitionerSelected: computed(() => {
      const id = newEgress.petitionerId();
      const agent = agents().find(a => a.id == id);
      return `${agent?.agentNumber} - ${agent?.name} ${agent?.lastName}`;
    }),
    agentSelected: computed(() => {
      return pagedAgents.data().find(a => a.id === idAgentSelected())
    }),
    newAgressValid: computed(() => {
      return newEgress.amountRemoved() != 0 && newEgress.petitionerId() != ''
    }),
    inventoryHasData: computed(() => {
      return products.data().length > 0;
    }),
    thereIsAProductSelected: computed(() => {
      return selectedProduct().id !== '';
    }),
    fullNameOfTheSelectedProduct: computed(() => `${selectedProduct().name} ${selectedProduct().supplierPart}`)
  }))

);
