import React, { ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, CellButton, CellButtonColor, InputText } from '../ui-kit';
import { useReturnToMain } from '../../hooks';
import { painterActions, usePainterState } from '../../store/painter.slice';
import { drawGrid, resetCanvas } from './canvasUitls';
import { useActions } from '../../store';
import '../../styles/painter.style.css';
import { useAddDataToNetworkMutation, useLazyGetAllDataSetQuery } from '../../store/neuralNetwork.api';

export const ControlPanel = memo(() => {
  const { canvasContext } = usePainterState();
  const { returnToMain } = useReturnToMain();
  const { setBrushColor } = useActions(painterActions);
  const { canvasSize, brushColor } = usePainterState();
  const [name, setName] = useState('');
  const [addNewData] = useAddDataToNetworkMutation();
  const [getAllDataSet, { data: neuralNetworkData }] = useLazyGetAllDataSetQuery();

  useEffect(() => {
    if (!neuralNetworkData) return;
    console.log(neuralNetworkData);
  }, [neuralNetworkData]);

  const clearCanvas = useCallback(() => {
    resetCanvas(canvasContext, canvasSize.width, canvasSize.height);
  }, [canvasContext, canvasSize]);

  const addToLearnPool = useCallback(async () => {
    const result = drawGrid(canvasContext, canvasSize.width, canvasSize.height, true);
    if (!result) return;
    try {
      await addNewData({ name, value: result });
    } catch (error) {
      console.log(error);
    }
  }, [canvasContext, name, canvasSize]);

  const checkImage = useCallback(() => {
    getAllDataSet();
  }, [canvasContext, getAllDataSet]);

  const showGridCell = useCallback(() => {
    drawGrid(canvasContext, canvasSize.width, canvasSize.height, true);
  }, [canvasContext, canvasSize]);

  const selectColor = useCallback(
    (color: CellButtonColor) => {
      setBrushColor(color);
    },
    [setBrushColor],
  );

  const onChangeName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) return;
      setName(e.target.value);
    },
    [setName],
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <InputText onChange={onChangeName} value={name} label={'Claster name'} />
          <Button onClick={addToLearnPool} text={'Add image to neural network'} />
        </div>
        <Button onClick={checkImage} text={'Check image'} />
        <Button onClick={returnToMain} text={'Go to main page'} />
      </div>
    </>
  );
});
