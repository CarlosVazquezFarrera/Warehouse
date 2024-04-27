import { Metadata } from "./metadata";

export interface PagedResponse<T> {
  data: Array<T>,
  metadata: Metadata
}
