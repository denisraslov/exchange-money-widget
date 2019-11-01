import { Currency } from '../../const/currency';
import { ActionType } from './actions';
import reducer from './reducer';

describe('Rates reducer', () => {
  it('returns the default state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('handles the FETCH_RATES_REQUEST action', () => {
    expect(reducer(
      {
        [Currency.USD]: {
          isFetching: false,
        },
      },
      {
        data: {
          currency: Currency.USD,
        },
        type: ActionType.FETCH_RATES_REQUEST,
      },
    )).toEqual({
      [Currency.USD]: {
        isFetching: true,
      },
    });

    expect(reducer({}, {
      data: {
        currency: Currency.USD,
      },
      type: ActionType.FETCH_RATES_REQUEST,
    })).toEqual({
      [Currency.USD]: {
        isFetching: true,
      },
    });
  });

  it('handles the FETCH_RATES_RESPONSE_SUCCESS action', () => {
    expect(reducer(
      {
        [Currency.USD]: {
          isFetching: true,
        },
      },
      {
        data: {
          currency: Currency.USD,
          response: {
            base: Currency.USD,
            rates: {
              [Currency.EUR]: 1,
            },
          },
        },
        type: ActionType.FETCH_RATES_RESPONSE_SUCCESS,
      },
    )).toEqual({
      [Currency.USD]: {
        isFetching: false,
        isLoaded: true,
        rates: {
          [Currency.EUR]: 1,
        },
      },
    });

    expect(reducer(
      {},
      {
        data: {
          currency: Currency.USD,
          response: {
            base: Currency.USD,
            rates: {
              [Currency.EUR]: 1,
            },
          },
        },
        type: ActionType.FETCH_RATES_RESPONSE_SUCCESS,
      },
    )).toEqual({
      [Currency.USD]: {
        isFetching: false,
        isLoaded: true,
        rates: {
          [Currency.EUR]: 1,
        },
      },
    });
  });

  it('handles the FETCH_RATES_RESPONSE_ERROR action', () => {
    expect(reducer(
      {
        [Currency.USD]: {
          isFetching: true,
        },
      },
      {
        data: { currency: Currency.USD },
        type: ActionType.FETCH_RATES_RESPONSE_ERROR,
      },
    )).toEqual({
      [Currency.USD]: {
        isFetching: false,
      },
    });

    expect(reducer(
      {},
      {
        data: { currency: Currency.USD },
        type: ActionType.FETCH_RATES_RESPONSE_ERROR,
      },
    )).toEqual({
      [Currency.USD]: {
        isFetching: false,
      },
    });
  });
});