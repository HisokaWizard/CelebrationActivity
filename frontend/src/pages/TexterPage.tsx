import React, { memo } from 'react';
import { Button } from '../components/ui-kit';
import { useReturnToMain } from '../hooks';

export const TexterPage = memo(() => {
  const { returnToMain } = useReturnToMain();

  return (
    <div>
      <Button onClick={returnToMain} text={'Go to main page'} />
    </div>
  );
});
