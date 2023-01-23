import React, { memo } from 'react';
import '../styles/painter.style.css';

export const PainterPage = memo(() => {
  return (
    <div className="painterGridContainer">
      <div className="painterDrawZone">Will be cancas</div>
      <div className="controlZone">Will be control panel</div>
    </div>
  );
});
