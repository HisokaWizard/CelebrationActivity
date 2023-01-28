import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosQuery, baseQuery } from '../utils';

export interface NeuralNetworkData {
  name: string;
  value: Array<number>;
}

export const neuralNetworkApi = createApi({
  reducerPath: 'neuralNetworkApi',
  baseQuery,
  tagTypes: ['auth'],
  endpoints: (builder) => ({
    addDataToNetwork: builder.mutation<void, NeuralNetworkData>({
      query: (data) => axiosQuery.post('neural-network', data),
    }),
    getAllDataSet: builder.query<any, void>({
      query: () => axiosQuery.get('neural-network'),
    }),
  }),
});

export const { useAddDataToNetworkMutation, useGetAllDataSetQuery, useLazyGetAllDataSetQuery } = neuralNetworkApi;
