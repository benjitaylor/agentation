export interface NavigationInfo {
  routeName?: string;
  routeParams?: Record<string, unknown>;
  navigationPath?: string;
}

export type NavigationResolver = () => NavigationInfo | undefined;

interface NavigationState {
  routes: Array<{ name: string; params?: unknown; state?: NavigationState }>;
  index: number;
}

declare global {
  var __REACT_NAVIGATION_DEVTOOLS__: {
    navigatorRef?: {
      current?: {
        getRootState?: () => NavigationState | undefined;
      };
    };
  } | undefined;
  var __expo_router_store__: {
    getState?: () => NavigationState | undefined;
  } | undefined;
}

export const reactNavigationResolver: NavigationResolver = () => {
  try {
    const globalNav = global.__REACT_NAVIGATION_DEVTOOLS__;
    if (globalNav?.navigatorRef?.current) {
      const state = globalNav.navigatorRef.current.getRootState?.();
      if (state) {
        const route = getActiveRoute(state);
        if (route) {
          return {
            routeName: route.name,
            routeParams: route.params as Record<string, unknown> | undefined,
            navigationPath: buildNavigationPath(state),
          };
        }
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
};

export const expoRouterResolver: NavigationResolver = () => {
  try {
    const expoStore = global.__expo_router_store__;
    if (expoStore) {
      const state = expoStore.getState?.();
      if (state?.routes) {
        const route = getActiveRoute(state);
        if (route) {
          return {
            routeName: route.name,
            routeParams: route.params as Record<string, unknown> | undefined,
            navigationPath: buildNavigationPath(state),
          };
        }
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
};

const defaultResolvers: NavigationResolver[] = [
  reactNavigationResolver,
  expoRouterResolver,
];

export function getNavigationInfo(
  customResolver?: NavigationResolver
): NavigationInfo | undefined {
  if (customResolver) {
    const result = customResolver();
    if (result) return result;
  }

  for (const resolver of defaultResolvers) {
    const result = resolver();
    if (result) return result;
  }

  return undefined;
}

function getActiveRoute(state: NavigationState): { name: string; params?: unknown } | undefined {
  if (!state || !state.routes) return undefined;
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRoute(route.state);
  }
  return route;
}

function buildNavigationPath(state: NavigationState): string {
  const parts: string[] = [];
  let current: NavigationState | undefined = state;
  while (current && current.routes) {
    const route: { name: string; params?: unknown; state?: NavigationState } = current.routes[current.index];
    parts.push(route.name);
    current = route.state;
  }
  return parts.join('/');
}
