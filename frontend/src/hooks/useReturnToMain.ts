import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useReturnToMain = () => {
  const navigate = useNavigate();

  const returnToMain = useCallback(() => {
    navigate('/');
  }, []);

  return {
    returnToMain,
  };
};
