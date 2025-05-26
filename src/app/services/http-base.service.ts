import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { environment } from "@environments/environment";
import { PagedResponse } from "@models/custom/pagedResonse";
import { lastValueFrom } from "rxjs";

export abstract class HttpBase<TDto, TNewEntity> {
  constructor(controller: string) {
    this.apiUrl = `${environment.baseApiUrl}${controller}`;
  }
  protected http: HttpClient = inject(HttpClient);
  protected apiUrl: string;
  protected pageNumber = environment.pagination.defaultPageNumber;
  protected pageSize = environment.pagination.defaultPageSize;

  public async getById<T>(id: string): Promise<TDto> {
    return await lastValueFrom(this.http.get<TDto>(`${this.apiUrl}/?Id=${id}`));
  }

  public async getAll(): Promise<Array<TDto>> {
    return await lastValueFrom(this.http.get<Array<TDto>>(this.apiUrl));
  }
  public async getPaged(pageNumber?: number, pageSize?: number, methodName = 'getPaged'): Promise<PagedResponse<TDto>> {
    pageNumber = pageNumber ?? this.pageNumber;
    pageSize = pageSize ?? this.pageSize;

    const url = `${this.apiUrl}/${methodName}`;

    return await lastValueFrom(this.http.get<PagedResponse<TDto>>(`${url}?pageNumber=${pageNumber}&pageSize=${pageSize}`));
  }

  public async getPagedWithSearch(search?: string, pageNumber?: number, pageSize?: number, methodName: string = ''): Promise<PagedResponse<TDto>> {
    pageNumber = pageNumber ?? this.pageNumber;
    pageSize = pageSize ?? this.pageSize;
    search = search ?? '';
    return await lastValueFrom(this.http.get<PagedResponse<TDto>>(`${this.apiUrl}/${methodName}?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`));
  }

  public async getPagedWithFilters(method?: string, filters?: Array<string>): Promise<PagedResponse<TDto>> {
    let url = this.apiUrl;
    if (method) {
      url = `${this.apiUrl}/${method}`;
    }

    if (filters && filters.length > 0) {
      url += `?${filters.join('&')}`;
    }

    return await lastValueFrom(this.http.get<PagedResponse<TDto>>(url));

  }

  public async post(body: TNewEntity): Promise<TDto> {
    return await lastValueFrom(this.http.post<TDto>(this.apiUrl, body));
  }

  public async put<TType = TDto>(body: TType): Promise<TDto> {
    return await lastValueFrom(this.http.put<TDto>(this.apiUrl, body));
  }

  public async delete(id: string): Promise<boolean> {
    return await lastValueFrom(this.http.delete<boolean>(this.apiUrl));
  }
}
