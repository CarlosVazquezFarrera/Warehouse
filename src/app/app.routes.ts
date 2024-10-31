import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AppRoutes } from '@routes/app-routers';
import { isLoggenInGuard } from '@guards/is-loggen-in.guard';
import { isNotLoggenInGuard } from '@guards/is-not-loggen-in.guard';

export const routes: Routes = [
  { path: AppRoutes.login, component: LoginComponent, canActivate: [isNotLoggenInGuard] },
  {
    path: AppRoutes.dashboard.path,
    canActivate: [isLoggenInGuard],
    loadComponent: () => import('@components/dashboard/dashboard.component').then(c => c.DashboardComponent),
    children: [
      // { path: 'account/:id', component: AccountDetailComponent }
      { path: `${AppRoutes.dashboard.children.inventory}/:idSupply/:idAirport`, loadComponent: () => import('@components/dashboard/modules/inventory/inventory.component').then(i => i.InventoryComponent) },
      { path: AppRoutes.dashboard.children.inventory, loadComponent: () => import('@components/dashboard/modules/inventory/inventory.component').then(i => i.InventoryComponent) },
      { path: AppRoutes.dashboard.children.agents, loadComponent: () => import('@components/dashboard/modules/agents/agents.component').then(a => a.AgentsComponent) },
      { path: AppRoutes.dashboard.children.products, loadComponent: () => import('@components/dashboard/modules/products/products.component').then(a => a.ProductsComponent) },
      { path: AppRoutes.dashboard.children.admin, loadComponent: () => import('@components/dashboard/modules/admin/admin.component').then(a => a.AdminComponent) },
      { path: '', redirectTo: AppRoutes.dashboard.children.inventory, pathMatch: 'full' }

    ]
  },
  { path: '', redirectTo: AppRoutes.login, pathMatch: 'full' }
];
