import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useActions } from '../../store';
import { painterActions, usePainterState } from '../../store/painter.slice';
import { freeDraw, resetCanvas } from './canvasUitls';

export const CanvasPanel = memo(() => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { setCanvas, setCanvasContext, setCanvasSize } = useActions(painterActions);
  const { canvasSize, brushColor, canvasContext } = usePainterState();

  const changeScreenSize = useCallback(() => {
    if (!canvasContainerRef.current) return;
    setCanvasSize({ width: canvasContainerRef.current.offsetWidth, height: window.innerHeight });
  }, [canvasContainerRef.current]);

  useEffect(() => {
    if (!canvasContext) return;
    const { mouseDownCallback, mouseMoveCallback, mouseUpCallback } = freeDraw(canvasContext, canvasSize.width, canvasSize.height, brushColor);

    window.addEventListener('mousedown', mouseDownCallback);
    window.addEventListener('mouseup', mouseUpCallback);
    window.addEventListener('mousemove', mouseMoveCallback);

    return () => {
      window.removeEventListener('mousedown', mouseDownCallback);
      window.removeEventListener('mouseup', mouseUpCallback);
      window.removeEventListener('mousemove', mouseMoveCallback);
    };
  }, [brushColor, canvasContext]);

  useEffect(() => {
    changeScreenSize();
    window.addEventListener('resize', changeScreenSize);
    return () => {
      window.removeEventListener('resize', changeScreenSize);
    };
  }, [canvasContainerRef.current]);

  useEffect(() => {
    if (!canvas.current || !canvas.current.getContext) return;
    setCanvas(canvas.current);
    const canvasContext = canvas.current.getContext('2d');
    if (!canvasContext) return;
    resetCanvas(canvasContext, canvasSize.width, canvasSize.height);
    setCanvasContext(canvasContext);
  }, [canvas.current, canvasSize]);

  return (
    <div ref={canvasContainerRef}>
      <canvas id="painter" width={canvasSize.width} height={canvasSize.height} ref={canvas}></canvas>
    </div>
  );
});
