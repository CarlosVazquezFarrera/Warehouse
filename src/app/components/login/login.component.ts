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


  public formLogin = this.fb.group(
    {
      emploeeNumber: ['303683', [Validators.required, Validators.minLength(6), onlyNumbers()]],
      passWord: ['Lish2349', [Validators.required]]
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
    const user = await this.store.login(this.emploeeNumber.value, this.passWord.value);
    if (user) {
      this.sessionService.login(user);
      this.router.navigateByUrl(AppRoutes.dashboard.path);
    }
  }
  //#endregion
}
