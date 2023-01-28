import React, { ChangeEventHandler, memo } from 'react';

interface Props {
  value: string;
  label: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const InputText = memo(({ value, onChange, label }: Props) => {
  return <input type={'text'} className={'inputText'} value={value} onChange={onChange} title={label} placeholder={label} />;
});
