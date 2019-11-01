import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Currency } from '../../const/currency';
import { ActionType, exchangeCurrency } from './actions';

const middlewares = [thunk];
const mockStore = createMockStore(middlewares);

describe('Balance actions', () => {
  it('dispatches EXCHANGE_CURRENCY action with correct data', () => {
    const storeState = {
      balances: {
        [Currency.USD]: 0,
        [Currency.EUR]: 100,
      },
      rates: {
        [Currency.EUR]: {
          isFetching: false,
          isLoaded: true,
          rates: { [Currency.USD]: 2 },
        },
      },
    };
    const store = mockStore(storeState);

    store.dispatch(exchangeCurrency({
      currencyFrom: Currency.EUR,
      currencyTo: Currency.USD,
      valueFrom: 10,
    }));
    expect(store.getActions()).toEqual([
      {
        data: {
          valueFrom: 10,
          valueTo: 20,
          currencyFrom: Currency.EUR,
          currencyTo: Currency.USD,
        },
        type: ActionType.EXCHANGE_CURRENCY,
      },
    ]);
  });

  it('doesn\'t dispatch actions if rates for currency are not loaded', () => {
    const storeState = {
      balances: {
        [Currency.USD]: 100,
        [Currency.EUR]: 0,
      },
      rates: {
        [Currency.USD]: {
          isFetching: true,
        },
      },
    };
    const store = mockStore(storeState);

    store.dispatch(exchangeCurrency({
      currencyFrom: Currency.USD,
      currencyTo: Currency.EUR,
      valueFrom: 10,
    }));
    expect(store.getActions().length).toEqual(0);
  });

  it('doesn\'t dispatch actions if there is no rate for currency', () => {
    const storeState = {
      balances: {
        [Currency.USD]: 100,
        [Currency.EUR]: 0,
      },
      rates: {
        [Currency.USD]: {
          isFetching: false,
          isLoaded: true,
          rates: {},
        },
      },
    };
    const store = mockStore(storeState);

    store.dispatch(exchangeCurrency({
      currencyFrom: Currency.USD,
      currencyTo: Currency.EUR,
      valueFrom: 10,
    }));
    expect(store.getActions().length).toEqual(0);
  });

  it('doesn\'t dispatch actions if there is not enough source balance', () => {
    const storeState = {
      balances: {
        [Currency.USD]: 1,
        [Currency.EUR]: 100,
      },
      rates: {
        [Currency.USD]: {
          isFetching: false,
          isLoaded: true,
          rates: { [Currency.EUR]: 2 },
        },
      },
    };
    const store = mockStore(storeState);

    store.dispatch(exchangeCurrency({
      currencyFrom: Currency.USD,
      currencyTo: Currency.EUR,
      valueFrom: 10,
    }));
    expect(store.getActions().length).toEqual(0);
  });
});