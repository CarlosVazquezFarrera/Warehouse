import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import * as jsonErrors from './login-metadata.json';
import { onlyNumbers } from '@validators/only-numbers';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';
import { WarehouseStore } from '@store/warehouse.store';
import { Router } from '@angular/router';
import { AppRoutes } from '@routes/app-routers';
import { SessionService } from '@services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor() {
    ErrorMessageHandle(this.emploeeNumber, this.errorEmploeeNumber, jsonErrors.errors.emploeeNumber)
  }
  //#region Properties
  public fb = inject(FormBuilder);
  private store = inject(WarehouseStore);
  private router = inject(Router);
  private sessionService = inject(SessionService);
  public hide = true;


  public formLogin = this.fb.group(
    {
      emploeeNumber: ['', [Validators.required, Validators.minLength(6), onlyNumbers()]],
      passWord: ['', [Validators.required]]
    },
  )

  public emploeeNumber: AbstractControl = this.formLogin.get('emploeeNumber')!;
  public passWord: AbstractControl = this.formLogin.get('passWord')!;

  public errorEmploeeNumber = signal(jsonErrors.errors.emploeeNumber.required);
  public errorpassWord = jsonErrors.errors.password.required;
  //#endregion

  //#region Methods
  public async login() {
    if (!this.formLogin.touched)
      this.formLogin.markAllAsTouched();
    if (this.formLogin.invalid)
      return;
    await this.store.login(this.emploeeNumber.value, this.passWord.value);
    const user = this.store.agent();
    const token = this.store.token();
    if (user && token) {
      this.sessionService.login(user, token);
      this.router.navigateByUrl(AppRoutes.dashboard.path);
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
  //#endregion
}
