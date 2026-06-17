import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { PagedResult } from '../../models/custom/pagedResult';

@Injectable({
  providedIn: 'root'
})
export abstract class HttpGetService<TDto> {
  protected apiUrl!: string;

  constructor(protected http: HttpClient, controller: string) {
    this.apiUrl = `${environment.API_BASE_URL}${controller}`;
  }

  protected buildQueryParams(params: Record<string, unknown | null | undefined>): HttpParams {
    return Object.entries(params).reduce((query, [key, value]) => {
      if (value === undefined || value === null || value === '') {
        return query;
      }
      return query.set(key, String(value));
    }, new HttpParams());
  }

  protected normalizeSearchParams<TSearch>(searchParams: TSearch): Record<string, unknown> {
    if (searchParams === null || searchParams === undefined) {
      return {};
    }

    if (typeof searchParams === 'string' || typeof searchParams === 'number' || typeof searchParams === 'boolean') {
      return { query: searchParams };
    }

    return searchParams as unknown as Record<string, unknown>;
  }

  async getAll(): Promise<TDto[]> {
    return lastValueFrom(this.http.get<TDto[]>(this.apiUrl));
  }

  async getById(id: string): Promise<TDto> {
    return lastValueFrom(this.http.get<TDto>(`${this.apiUrl}/${id}`));
  }

  async getPaged(page: number = environment.pagination.defaultPageNumber, pageSize: number = environment.pagination.defaultPageSize, action: string = 'paged'): Promise<PagedResult<TDto>> {
    const params = this.buildQueryParams({ page, pageSize });
    const url = action ? `${this.apiUrl}/${action}` : this.apiUrl;
    return lastValueFrom(this.http.get<PagedResult<TDto>>(url, { params }));
  }

  async search<TSearch>( searchParams?: TSearch, page: number = environment.pagination.defaultPageNumber, pageSize: number = environment.pagination.defaultPageSize, action: string = 'paged'): Promise<PagedResult<TDto>> {
    const params = this.buildQueryParams({
      ...this.normalizeSearchParams(searchParams),
      page,
      pageSize,
    });
    const url = action ? `${this.apiUrl}/${action}` : this.apiUrl;
    return lastValueFrom(this.http.get<PagedResult<TDto>>(url, { params }));
  }
}
