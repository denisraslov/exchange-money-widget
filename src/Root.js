import React from 'react';
import { Provider } from 'react-redux';
import App from './components/App';
import { createStore } from './data/store';
import 'antd/dist/antd.css';

function Root() {
  return (
    <Provider store={createStore()}>
      <App />
    </Provider>
  );
}

export default Root;
