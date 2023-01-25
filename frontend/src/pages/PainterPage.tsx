import React, { memo } from 'react';
import { CanvasPanel, ControlPanel } from '../components/Painter';
import '../styles/painter.style.css';

export const PainterPage = memo(() => {
  return (
    <div className="painterGridContainer">
      <div className="painterDrawZone">
        <CanvasPanel />
      </div>
      <div className="controlZone">
        <ControlPanel />
      </div>
    </div>
  );
});
