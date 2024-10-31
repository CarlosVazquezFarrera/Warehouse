import { Presentation } from "@models/DTO/presentation";

export type NewPresentation = Omit<Presentation, 'id'>;