
import React from 'react';
import { Card } from 'antd';
import WidgetContainer from './../WidgetContainer';

import styles from './index.module.css';

const CARD_WIDTH = 300;

function App() {
  return (
    <div className={styles.card}>
      <Card
        title="Exchange money"
        bordered={true}
        style={{ width: CARD_WIDTH }}
      >
        <WidgetContainer />
      </Card>
    </div>
  );
}

export default App;
