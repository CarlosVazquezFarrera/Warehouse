import { Department } from "@models/DTO/department";

export type NewDepartment = Omit<Department, 'id'>;