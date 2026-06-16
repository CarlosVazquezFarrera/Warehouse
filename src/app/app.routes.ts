import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AppRoutes } from '@routes/app-routers';
import { isLoggedInGuard } from '@guards/is-logged-in.guard';

export const routes: Routes = [
  { path: '', redirectTo: AppRoutes.login, pathMatch: 'full' },
  { path: AppRoutes.login, component: LoginComponent, canActivate: [isLoggedInGuard(false, AppRoutes.dashboard.path)] },
  {
    path: AppRoutes.dashboard.path,
    canActivate: [isLoggedInGuard(true, AppRoutes.login)],
    loadComponent: () => import('@components/dashboard/dashboard.component').then(c => c.DashboardComponent),
    children: [
      { path: `${AppRoutes.dashboard.children.inventory}/:idSupply/:idAirport`, loadComponent: () => import('@components/dashboard/modules/inventory/inventory.component').then(i => i.InventoryComponent) },
      { path: AppRoutes.dashboard.children.inventory, loadComponent: () => import('@components/dashboard/modules/inventory/inventory.component').then(i => i.InventoryComponent) },
      { path: AppRoutes.dashboard.children.products, loadComponent: () => import('@components/dashboard/modules/products/products.component').then(a => a.ProductsComponent) },
      { path: '', redirectTo: AppRoutes.dashboard.children.inventory, pathMatch: 'full' }

    ]
  },
];
