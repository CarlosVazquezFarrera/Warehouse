import { EntryDto } from "@models/Dto/entryDto";

export type Entry = Omit<EntryDto, 'id'>;
