import { InventoryItem } from "@models/api/inventoryItem";
import { Metadata } from "@models/custom/metadata";
import { PagedResponse } from "@models/custom/pagedResonse";
import { Agent } from "@models/DTO/agent";
import { Airport } from "@models/DTO/airport";
import { PackagingType } from "@models/DTO/packagingType";
import { Presentation } from "@models/DTO/presentation";
import { Product } from "@models/DTO/product";
import { ProductFormat } from "@models/DTO/productFormat";
import { AgentBaseInfo } from "@models/types/agentBaseInfo";
import { NewEgress } from "@models/types/newEgress";

//#region Types
export type DashBoard = {
    airports: Airport[],
    agents: AgentBaseInfo[],
    missingProduct: Product[],
    newEgress: NewEgress,
    products: PagedResponse<Product>,
    selectedProduct: Product,
    idAirportSelected: string,
    pagedAgents: PagedResponse<Agent>,
    idAgentSelected: string,
    idSupplyScanned: string,
    packagingTypes: Array<PackagingType>,
    presentations: Array<Presentation>,
    productFormats: Array<ProductFormat>,
  }
export const initialNewEgress: NewEgress = {
    amountRemoved: 0,
    petitionerId: "",
    productId: ""
  }
  
  const initialMetadata: Metadata = {
    totalCount: 0,
    pageSize: 0,
    currentPage: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };
  
  export const initialSelectedProduct: Product = {
    id: "",
    name: "",
    supplierPart: "",
    packagingTypeId: "",
    presentationId: "",
    presentationQuantity: 0,
    formatQuantity: 0,
    productFormatId: "",
    stock: 0,
    airportId: "",
    packagingTypeName: "",
    productFormatName: "",
    presentationName: ""
  }
  export const initialDashBoardState: DashBoard = {
    airports: [],
    agents: [],
    newEgress: initialNewEgress,
    products: {
      data: [],
      metadata: initialMetadata
    },
    selectedProduct: initialSelectedProduct,
    missingProduct: [],
    idAirportSelected: "",
    pagedAgents: {
      data: [],
      metadata: initialMetadata
    },
    idAgentSelected: "",
    idSupplyScanned: "",
    packagingTypes: [],
    presentations: [],
    productFormats: []
  }
  //#endregion
  