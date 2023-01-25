import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '.';
import { CellButtonColor } from '../components';
import { Nullable } from '../utils';

interface PainterPageState {
  canvas: Nullable<HTMLCanvasElement>;
  canvasContext: Nullable<CanvasRenderingContext2D>;
  canvasSize: {
    width: number;
    height: number;
  };
  brushColor: CellButtonColor;
}

const initialState: PainterPageState = {
  canvas: null,
  canvasContext: null,
  canvasSize: {
    width: 0,
    height: 0,
  },
  brushColor: 'dimgray',
};

const { reducer, actions } = createSlice({
  name: 'painter',
  initialState,
  reducers: {
    setCanvas: (state, action: PayloadAction<Nullable<HTMLCanvasElement>>) => {
      state.canvas = action.payload;
    },
    setCanvasContext: (state, action: PayloadAction<Nullable<CanvasRenderingContext2D>>) => {
      state.canvasContext = action.payload;
    },
    setCanvasSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.canvasSize = action.payload;
    },
    setBrushColor: (state, action: PayloadAction<CellButtonColor>) => {
      state.brushColor = action.payload;
    },
  },
});

export const painterActions = {
  setCanvas: actions.setCanvas,
  setCanvasContext: actions.setCanvasContext,
  setCanvasSize: actions.setCanvasSize,
  setBrushColor: actions.setBrushColor,
};

export const painterReducer = reducer;

export const usePainterState = () => {
  return useSelector((state: RootState) => state.painterReducer);
};
