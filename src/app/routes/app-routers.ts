type Parents = 'dashboard';
type DashboardChildren = 'inventory' | 'products' | 'agents' | 'admin';
const dashboard: string = 'dashboard';
export const AppRoutes = {
  login: 'login',
  dashboard: {
    path: 'dashboard',
    children: {
      inventory: 'inventory',
      products: 'products',
      agents: 'agents',
      admin: 'admin'
    } as Record<DashboardChildren, string>
  }
}

export function getChildRoutePath(parentPath: Parents, childRoute: DashboardChildren): string {
  const parent = AppRoutes[parentPath];
  if (!parent.hasOwnProperty('path') || !parent.hasOwnProperty('children'))
    throw new Error('This is not a valid Parent');
  const child: string = parent.children[childRoute];
  return `${parent.path}/${child}`;
}


