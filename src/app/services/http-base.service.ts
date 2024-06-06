import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { environment } from "@environments/environment";
import { PagedResponse } from "@models/custom/pagedResonse";
import { lastValueFrom } from "rxjs";

export abstract class HttpBase<T> {
  constructor(controller: string) {
    this.apiUrl = `${environment.baseApiUrl}${controller}`;
  }
  protected http: HttpClient = inject(HttpClient);
  protected apiUrl: string;
  protected pageNumber = environment.pagination.defaultPageNumber;
  protected pageSize = environment.pagination.defaultPageSize;

  public async getById<T>(id: string): Promise<T> {
    return await lastValueFrom(this.http.get<T>(`${this.apiUrl}/?Id=${id}`));
  }

  public async getAll<T>(): Promise<Array<T>> {
    return await lastValueFrom(this.http.get<Array<T>>(this.apiUrl));
  }
  public async getPagedAll<T>(pageNumber?: number, pageSize?: number): Promise<PagedResponse<T>> {
    pageNumber = pageNumber ?? this.pageNumber;
    pageSize = pageSize ?? this.pageSize;
    return await lastValueFrom(this.http.get<PagedResponse<T>>(`${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`));
  }

  public async getPagedAllWithSearch<T>(search?: string, pageNumber?: number, pageSize?: number, methodName: string = ''): Promise<PagedResponse<T>> {
    pageNumber = pageNumber ?? this.pageNumber;
    pageSize = pageSize ?? this.pageSize;
    search = search ?? '';
    return await lastValueFrom(this.http.get<PagedResponse<T>>(`${this.apiUrl}/${methodName}?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`));
  }

  public async post<T, K>(body: K): Promise<T> {
    return await lastValueFrom(this.http.post<T>(this.apiUrl, body));
  }

  public async put<T>(body: T): Promise<T> {
    return await lastValueFrom(this.http.put<T>(this.apiUrl, body));
  }

  public async delete<T>(id: string): Promise<T> {
    return await lastValueFrom(this.http.delete<T>(this.apiUrl));
  }
}
