import React, { memo, useCallback } from 'react';
import '../../styles/ui-kit.style.css';

export type CellButtonColor = 'red' | 'blue' | 'green' | 'dimgray' | 'white';

interface Props {
  onClick: (color: CellButtonColor) => void;
  color: CellButtonColor;
  width?: number;
  height?: number;
  selected?: boolean;
}

export const CellButton = memo(({ onClick, color, width = 64, height = 64, selected }: Props) => {
  const onClickHandler = useCallback(() => {
    onClick(color);
  }, [color]);

  return (
    <div
      style={{
        backgroundColor: color,
        width,
        height,
        boxShadow: selected ? `0px 0px 3px 3px ${color}` : 'none',
      }}
      className="cellButtonView"
      onClick={onClickHandler}
    />
  );
});
