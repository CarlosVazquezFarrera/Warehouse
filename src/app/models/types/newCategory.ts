import { Category } from "@models/DTO/category";

export type NewCategory = Omit<Category, 'id'> 