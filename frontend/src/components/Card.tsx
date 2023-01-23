import React, { memo, ReactNode } from 'react';
import '../styles/card.style.css';

interface Props {
  onClick: () => void;
  children: ReactNode;
}

export const Card = memo(({ onClick, children }: Props) => {
  return (
    <div className="cardContainer" onClick={onClick}>
      {children}
    </div>
  );
});
