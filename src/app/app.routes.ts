import { Routes } from '@angular/router';
import { AppRoutes } from '../app-routers';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {path: AppRoutes.login, component: LoginComponent},
  { path: '', redirectTo: AppRoutes.login, pathMatch: 'full' }
];
