import React, { ChangeEventHandler, memo } from 'react';

interface Props {
  value: string;
  label: string;
  fontSize?: number;
  readOnly?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const InputText = memo(({ value, onChange, label, fontSize, readOnly }: Props) => {
  return (
    <input
      style={{ fontSize: `${fontSize}px` }}
      type={'text'}
      className={'inputText'}
      value={value}
      onChange={onChange}
      title={label}
      placeholder={label}
      readOnly={readOnly}
    />
  );
});
