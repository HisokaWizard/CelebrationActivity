import { TexterPage, PainterPage, MainPage } from '../pages';
import { RouteItem } from './routes.types';

export const routes: RouteItem[] = [
  { path: '/', component: MainPage },
  { path: '/texter', component: TexterPage },
  { path: '/painter', component: PainterPage },
];
