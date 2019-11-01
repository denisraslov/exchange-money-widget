import { fetchRatesForCurrency } from './../../api/rates';

export const ActionType = {
  FETCH_RATES_REQUEST: 'FETCH_RATES_REQUEST',
  FETCH_RATES_RESPONSE_SUCCESS: 'FETCH_RATES_RESPONSE_SUCCESS',
  FETCH_RATES_RESPONSE_ERROR: 'FETCH_RATES_RESPONSE_ERROR',
};

const fetchRatesRequest = (currency) => ({
  data: { currency },
  type: ActionType.FETCH_RATES_REQUEST,
});

export const fetchRates = (currency) =>
  (dispatch, getState) => {
    const currencyState = getState().rates[currency];
    if (currencyState && currencyState.isFetching) {
      return;
    }

    dispatch(fetchRatesRequest(currency));
    return fetchRatesForCurrency(currency)
      .then((response) => dispatch(fetchRatesResponseSuccess(currency, response)))
      .catch(() => dispatch(fetchRatesResponseError(currency)));
  };

const fetchRatesResponseSuccess = (currency, response) => ({
  data: { currency, response },
  type: ActionType.FETCH_RATES_RESPONSE_SUCCESS,
});

const fetchRatesResponseError = (currency) => ({
  data: { currency },
  type: ActionType.FETCH_RATES_RESPONSE_ERROR,
});