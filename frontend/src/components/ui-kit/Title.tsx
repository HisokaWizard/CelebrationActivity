import React, { memo, ReactNode } from 'react';
import '../../styles/ui-kit.style.css';

interface Props {
  children: ReactNode;
  textColor?: string;
}

export const Title = memo(({ children, textColor = 'white' }: Props) => {
  return (
    <div className="titleContainer" style={{ color: textColor }}>
      {children}
    </div>
  );
});
