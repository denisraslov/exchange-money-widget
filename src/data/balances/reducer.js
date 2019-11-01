import { ActionType } from './actions';
import { Currency } from './../../const/currency';
import { getBalanceForCurrency, roundSumResult } from './utils';

const DEFAULT_BALANCE = 100;

export function getDefaultState() {
  return {
    [Currency.USD]: DEFAULT_BALANCE,
    [Currency.EUR]: DEFAULT_BALANCE,
    [Currency.GBP]: DEFAULT_BALANCE,
  };
}

export default function balancesReducer(
  state = getDefaultState(),
  action
) {
  switch (action.type) {
    case ActionType.EXCHANGE_CURRENCY:
      return {
        ...state,
        [action.data.currencyFrom]:
          roundSumResult(getBalanceForCurrency(state, action.data.currencyFrom) - action.data.valueFrom),
        [action.data.currencyTo]:
          roundSumResult(getBalanceForCurrency(state, action.data.currencyTo) + action.data.valueTo),
      };
    default:
      return state;
  }
}