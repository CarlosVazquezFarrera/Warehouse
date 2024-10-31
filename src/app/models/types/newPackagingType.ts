import { PackagingType } from "@models/DTO/packagingType";

export type NewPackagingType = Omit<PackagingType, 'id'> 