import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { AppRoutes } from '@routes/app-routers';
import { isLoggenInGuard } from '@guards/is-loggen-in.guard';
import { isNotLoggenInGuard } from '@guards/is-not-loggen-in.guard';

export const routes: Routes = [
  { path: AppRoutes.login, component: LoginComponent, canActivate: [isNotLoggenInGuard]},
  { path: AppRoutes.dashboard, component: DashboardComponent, canActivate:[isLoggenInGuard]},
  { path: '', redirectTo: AppRoutes.login, pathMatch: 'full' }
];
