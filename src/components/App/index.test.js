import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from './../../data/store';
import App from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={createStore()}>
      <App />
    </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
