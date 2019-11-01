import { ActionType } from './actions';

export default function ratesReducer(state = {}, action) {
  switch (action.type) {
    case ActionType.FETCH_RATES_REQUEST: {
      const currencyState = state[action.data.currency];

      return {
        ...state,
        [action.data.currency]: {
          ...currencyState,
          isFetching: true,
        },
      };
    }

    case ActionType.FETCH_RATES_RESPONSE_SUCCESS: {
      const currencyState = state[action.data.currency];

      return {
        ...state,
        [action.data.currency]: {
          ...currencyState,
          isFetching: false,
          isLoaded: true,
          rates: action.data.response.rates,
        },
      };
    }

    case ActionType.FETCH_RATES_RESPONSE_ERROR: {
      const currencyState = state[action.data.currency];

      return {
        ...state,
        [action.data.currency]: {
          ...currencyState,
          isFetching: false,
        },
      };
    }

    default:
      return state;
  }
}