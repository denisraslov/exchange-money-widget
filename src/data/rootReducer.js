import { combineReducers } from 'redux';
import balances from './balances/reducer';
import rates from './rates/reducer';

export default combineReducers({
  balances,
  rates,
});