import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, CellButton, CellButtonColor } from '../ui-kit';
import { useReturnToMain } from '../../hooks';
import { painterActions, usePainterState } from '../../store/painter.slice';
import { drawGrid, resetCanvas } from './canvasUitls';
import { useActions } from '../../store';
import '../../styles/painter.style.css';

export const ControlPanel = memo(() => {
  const { canvasContext } = usePainterState();
  const { returnToMain } = useReturnToMain();
  const { setBrushColor } = useActions(painterActions);
  const { canvasSize, brushColor } = usePainterState();

  const clearCanvas = useCallback(() => {
    resetCanvas(canvasContext, canvasSize.width, canvasSize.height);
  }, [canvasContext, canvasSize]);

  const addToLearnPool = useCallback(() => {
    console.log(12345);
  }, [canvasContext]);

  const checkImage = useCallback(() => {
    console.log(12345);
  }, [canvasContext]);

  const showGridCell = useCallback(() => {
    drawGrid(canvasContext, canvasSize.width, canvasSize.height, true);
  }, [canvasContext, canvasSize]);

  const selectColor = useCallback(
    (color: CellButtonColor) => {
      setBrushColor(color);
    },
    [setBrushColor],
  );

  return (
    <>
      <div className="palleteInstrument">
        <CellButton onClick={selectColor} color={'red'} selected={brushColor === 'red'} />
        <CellButton onClick={selectColor} color={'green'} selected={brushColor === 'green'} />
        <CellButton onClick={selectColor} color={'blue'} selected={brushColor === 'blue'} />
        <CellButton onClick={selectColor} color={'dimgray'} selected={brushColor === 'dimgray'} />
        <CellButton onClick={selectColor} color={'white'} selected={brushColor === 'white'} width={128} />
      </div>
      <div className="neuralControlPanel">
        <Button onClick={clearCanvas} text={'Clear canvas'} />
        <Button onClick={showGridCell} text={'Show grid cell'} />
        <Button onClick={addToLearnPool} text={'Add image to neural network'} />
        <Button onClick={checkImage} text={'Check image'} />
        <Button onClick={returnToMain} text={'Go to main page'} />
      </div>
    </>
  );
});
