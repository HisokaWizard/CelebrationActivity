import React, { memo } from 'react';
import '../../styles/ui-kit.style.css';

interface Props {
  onClick: () => void;
  text?: string;
}

export const Button = memo(({ onClick, text }: Props) => {
  return (
    <button className="buttonView" onClick={onClick}>
      {text}
    </button>
  );
});
