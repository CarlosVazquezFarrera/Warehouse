import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() {
    this.apiUrl = `${environment.baseApiUrl}Login`;
  }

  private http: HttpClient = inject(HttpClient);
  private injector = inject(Injector);
  private apiUrl: string;



  public async login(agentNumber: string, password: string) {
    const user = {
      "pasword": password,
      "agentNumber": agentNumber
    }
    return await lastValueFrom(this.http.post(`${this.apiUrl}`, user))
  }
}
