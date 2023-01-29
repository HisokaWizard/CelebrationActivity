import React, { ChangeEvent, memo, useCallback, useEffect, useState } from 'react';
import { Button, CellButton, CellButtonColor, InputText } from '../ui-kit';
import { useReturnToMain } from '../../hooks';
import { painterActions, usePainterState } from '../../store/painter.slice';
import { drawGrid, resetCanvas } from './canvasUitls';
import { useActions } from '../../store';
import '../../styles/painter.style.css';
import { useAddDataToNetworkMutation, useLazyGetAllDataSetQuery } from '../../store/neuralNetwork.api';
import { NeuralNetwork, likely } from 'brain.js';
import { Chip } from '../ui-kit/Chip';
import { canvasHeight, canvasWidth } from './CanvasPanel';

type TrainDataType = { input: Array<number>; output: any };

export const ControlPanel = memo(() => {
  const { canvasContext } = usePainterState();
  const { returnToMain } = useReturnToMain();
  const { setBrushColor } = useActions(painterActions);
  const { brushColor } = usePainterState();
  const [name, setName] = useState('');
  const [addNewData] = useAddDataToNetworkMutation();
  const [getAllDataSet, { data: neuralNetworkData }] = useLazyGetAllDataSetQuery();
  const [clasters, setClasters] = useState<string[]>([]);
  const [neuralNetwork, setNeuralNetwork] = useState<any>();
  const [classifyResult, setClassifyResult] = useState<any>();

  useEffect(() => {
    if (!neuralNetworkData) return;
    const nn = new NeuralNetwork();
    const _clasters: string[] = [];
    const _trainData: TrainDataType[] = [];
    neuralNetworkData.forEach((it) => {
      _clasters.push(it.name);
      it.value.forEach((d) => {
        _trainData.push({ input: d, output: { [it.name]: 1 } });
      });
    });
    setClasters(_clasters);
    nn.train(_trainData, { log: true });
    setNeuralNetwork(nn);
  }, [neuralNetworkData]);

  const clearCanvas = useCallback(() => {
    resetCanvas(canvasContext, canvasWidth, canvasHeight);
  }, [canvasContext]);

  const addToLearnPool = useCallback(async () => {
    const result = drawGrid(canvasContext, canvasWidth, canvasHeight, true);
    if (!result) return;
    try {
      await addNewData({ name, value: result });
    } catch (error) {
      console.log(error);
    }
  }, [canvasContext, name]);

  const trainingNetwork = useCallback(() => {
    getAllDataSet();
  }, [canvasContext, getAllDataSet]);

  const checkImage = useCallback(() => {
    const result = drawGrid(canvasContext, canvasWidth, canvasHeight, true);
    if (!result) return;
    const res = likely(result, neuralNetwork);
    setClassifyResult(res);
  }, [canvasContext, getAllDataSet, neuralNetwork]);

  const showGridCell = useCallback(() => {
    drawGrid(canvasContext, canvasWidth, canvasHeight, true);
  }, [canvasContext]);

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
        {clasters.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {clasters.map((it, index) => (
              <Chip key={it + index} text={it} />
            ))}
          </div>
        )}
        <Button onClick={trainingNetwork} text={'Training network will all samples'} />
        <Button onClick={checkImage} text={'Classify image'} />
        <div style={{ marginTop: '10px' }}>Result of the classify: {classifyResult}</div>
        <Button onClick={returnToMain} text={'Go to main page'} />
      </div>
    </>
  );
});
