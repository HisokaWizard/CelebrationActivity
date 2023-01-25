import { ActionCreatorsMapObject, bindActionCreators, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { painterReducer } from './painter.slice';

export const store = configureStore({
  reducer: {
    painterReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useActions = <T extends ActionCreatorsMapObject>(actions: T) => {
  const dispatch = useDispatch();
  return useMemo(() => bindActionCreators(actions, dispatch), []);
};
