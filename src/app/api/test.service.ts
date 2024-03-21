import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  constructor(private http: HttpClient) {
  }

  public getInfo() {
    return this.http.get<any>("https://airportwarehouseapi.onrender.com/WeatherForecast");
  }
}

