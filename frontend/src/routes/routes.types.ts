import { ComponentType } from 'react';

export type RoutePath = '/' | '/texter' | '/painter';

export interface RouteItem {
  path: RoutePath | string;
  component: ComponentType;
}
