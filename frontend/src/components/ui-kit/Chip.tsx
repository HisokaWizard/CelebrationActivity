import React, { memo } from 'react';
import '../../styles/ui-kit.style.css';

interface Props {
  text: string;
}

export const Chip = memo(({ text }: Props) => {
  return <div className="chipView">{text}</div>;
});
