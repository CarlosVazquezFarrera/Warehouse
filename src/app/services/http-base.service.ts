import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { environment } from "@environments/environment";
import { PagedResponse } from "@models/custom/pagedResonse";
import { lastValueFrom } from "rxjs";

export abstract class HttpBase<T> {
  constructor(controller: string) {
    this.apiUrl = `${environment.baseApiUrl}${controller}`;
  }
  private http: HttpClient = inject(HttpClient);
  private apiUrl: string;

  public async getById<T>(id: string): Promise<T> {
    return await lastValueFrom(this.http.get<T>(`${this.apiUrl}/?Id=${id}`));
  }

  public async getAll<T>(): Promise<Array<T>> {
    return await lastValueFrom(this.http.get<Array<T>>(this.apiUrl));
  }
  public async getPagedAll<T>(pageNumber = environment.pagination.defaultPageNumber, pageSize = environment.pagination.defaultPageSize): Promise<PagedResponse<T>> {
    return await lastValueFrom(this.http.get<PagedResponse<T>>(`${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`));
  }

  public async post<T, K>(body: K): Promise<T> {
    return await lastValueFrom(this.http.post<T>(this.apiUrl, body));
  }

  public async put<T>( body: T): Promise<T> {
    return await lastValueFrom(this.http.put<T>(this.apiUrl, body));
  }

  public async delete<T>(id: string): Promise<T> {
    return await lastValueFrom(this.http.delete<T>(this.apiUrl));
  }
}
