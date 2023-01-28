import { ActionCreatorsMapObject, bindActionCreators, configureStore } from '@reduxjs/toolkit';
import { fetchBaseQuery, setupListeners } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { neuralNetworkApi } from './neuralNetwork.api';
import { painterReducer } from './painter.slice';

export const store = configureStore({
  reducer: {
    [neuralNetworkApi.reducerPath]: neuralNetworkApi.reducer,
    painterReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(neuralNetworkApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useActions = <T extends ActionCreatorsMapObject>(actions: T) => {
  const dispatch = useDispatch();
  return useMemo(() => bindActionCreators(actions, dispatch), []);
};
