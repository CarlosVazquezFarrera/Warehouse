type Parents = 'dashboard';
type DashboardChilden = 'inventory' | 'supplies';
const dashboard: string = 'dashboard';
export const AppRoutes = {
  login: 'login',
  dashboard: {
    path: 'dashboard',
    children: {
      inventory: 'inventory',
      supplies: 'supplies',
    }
  }
}

export function getChildRoutePath(parentPath: Parents, childRoute: DashboardChilden): string {
  const parent = AppRoutes[parentPath];
  if (!parent.hasOwnProperty('path') || !parent.hasOwnProperty('children'))
    throw new Error('This is not a valid Parent');
  const child: string = parent.children[childRoute];
  return `${parent.path}/${child}`;
}


