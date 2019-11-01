import { Currency } from '../../const/currency';
import { ActionType } from './actions';
import reducer, { getDefaultState } from './reducer';

describe('Balances reducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(getDefaultState());
  });

  it('handles the EXCHANGE_CURRENCY action', () => {
    expect(reducer(
      {
        [Currency.USD]: 100,
      },
      {
        data: {
          valueFrom: 10,
          valueTo: 10,
          currencyFrom: Currency.USD,
          currencyTo: Currency.EUR,
        },
        type: ActionType.EXCHANGE_CURRENCY,
      },
    )).toEqual({
      [Currency.USD]: 90,
      [Currency.EUR]: 10,
    });

    expect(reducer(
      {
        [Currency.USD]: 90,
        [Currency.EUR]: 10,
      },
      {
        data: {
          valueFrom: 5,
          valueTo: 20,
          currencyFrom: Currency.EUR,
          currencyTo: Currency.USD,
        },
        type: ActionType.EXCHANGE_CURRENCY,
      },
    )).toEqual({
      [Currency.USD]: 110,
      [Currency.EUR]: 5,
    });
  });
});