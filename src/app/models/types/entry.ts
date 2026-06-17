import { EntryDto } from "../Dto/entryDto";

export type Entry = Omit<EntryDto, 'id'>;
