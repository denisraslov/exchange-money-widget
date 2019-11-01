import { getBalanceForCurrency } from './utils';

export const ActionType = {
  EXCHANGE_CURRENCY: 'EXCHANGE_CURRENCY',
};

export const exchangeCurrency = ({
  currencyFrom,
  currencyTo,
  valueFrom,
}) => (dispatch, getState) => {
  const state = getState();
  const balanceFrom = getBalanceForCurrency(state.balances, currencyFrom);

  if (valueFrom > balanceFrom) {
    return;
  }

  const ratesState = state.rates[currencyFrom];

  if (!ratesState.isLoaded) {
    return;
  }

  const rate = ratesState.rates[currencyTo];

  if (rate === undefined) {
    return;
  }

  return dispatch({
    data: {
      valueFrom,
      valueTo: valueFrom * rate,
      currencyFrom,
      currencyTo,
    },
    type: ActionType.EXCHANGE_CURRENCY,
  });
};