import React, { memo, useCallback, useEffect, useState } from 'react';
import { Button, CellButton, CellButtonColor } from '../ui-kit';
import { useReturnToMain } from '../../hooks';
import { painterActions, usePainterState } from '../../store/painter.slice';
import { resetCanvas } from './canvasUitls';
import { useActions } from '../../store';
import '../../styles/painter.style.css';
import { load } from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import * as tfc from '@tensorflow/tfjs-core';

let model: any = null;

export const ControlPanel = memo(() => {
  const { canvasContext, canvasSize, canvas } = usePainterState();
  const { returnToMain } = useReturnToMain();
  const { setBrushColor } = useActions(painterActions);
  const { brushColor } = usePainterState();
  const [] = useState();

  useEffect(() => {
    tf.ready().then(() => {
      load()
        .then((result) => {
          model = result;
        })
        .catch((error) => {
          console.error('Neural network load error: ', error);
        });
    });
  }, []);

  const clearCanvas = useCallback(() => {
    resetCanvas(canvasContext, canvasSize.width, canvasSize.height);
  }, [canvasContext, canvasSize]);

  const selectColor = useCallback(
    (color: CellButtonColor) => {
      setBrushColor(color);
    },
    [setBrushColor, canvasSize],
  );

  const classifyImage = useCallback(async () => {
    try {
      const result = await model.classify(canvas);
      console.log(result);
    } catch (error) {
      console.error('Neural network classify error: ', error);
    }
  }, [canvas]);

  const loadImageToCanvas = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!canvasContext) return;
      const file = event.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = (e) => {
        if (!e) return;
        URL.revokeObjectURL((e.currentTarget as any)?.src);
        canvasContext.drawImage(e.currentTarget as any, 0, 0);
      };
      img.src = url;
    },
    [canvasContext],
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
        <input style={{ paddingTop: '10px' }} width={100} type="file" onChange={loadImageToCanvas} />
        <Button onClick={classifyImage} text={'Classify current image'} />
        <Button onClick={returnToMain} text={'Go to main page'} />
      </div>
    </>
  );
});
