import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { environment } from "@environments/environment";
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

  public async getAll<T>(): Promise<T> {
    return await lastValueFrom(this.http.get<T>(this.apiUrl));
  }

  public async post<T, K>(body: K): Promise<T> {
    return await lastValueFrom(this.http.post<T>(this.apiUrl, body));
  }

  public async put<T, K>( body: K): Promise<T> {
    return await lastValueFrom(this.http.put<T>(this.apiUrl, body));
  }

  public async delete<T>(id: string): Promise<T> {
    return await lastValueFrom(this.http.delete<T>(this.apiUrl));
  }
}
