import React, { CSSProperties, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Title } from '../components';
import '../styles/general.style.css';

const mainTitleColor = '#e2e2e2';
const cardTextStyle: CSSProperties = {
  fontSize: 32,
  color: 'lightblue',
};

export const MainPage = memo(() => {
  const navigate = useNavigate();

  const painterClick = useCallback(() => {
    navigate('/painter');
  }, []);

  const textClick = useCallback(() => {
    navigate('/texter');
  }, []);

  return (
    <div>
      <Title textColor={mainTitleColor}>Main page</Title>
      <div className="gridContainer">
        <div>
          <Card onClick={painterClick}>
            <span style={cardTextStyle}>Painter</span>
          </Card>
        </div>
        <div>
          <Card onClick={textClick}>
            <span style={cardTextStyle}>Texter</span>
          </Card>
        </div>
      </div>
    </div>
  );
});
