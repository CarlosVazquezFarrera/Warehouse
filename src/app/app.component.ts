import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestService } from './api/test.service';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe, JsonPipe } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private readonly testService: TestService = inject(TestService);
  public data$!: Observable<any>;
  title = 'almacen';

  ngOnInit(): void {
    this.data$ = this.testService.getInfo();
  }
}
