import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchRatesForCurrency } from '../../api/rates';
import { Currency } from '../../const/currency';
import { fetchRates, ActionType } from './actions';

jest.mock('../../api/rates');

const middlewares = [thunk];
const mockStore = createMockStore(middlewares);

describe('Rate actions', () => {
  it('dispatches FETCH_RATES_RESPONSE_SUCCESS on request success', async () => {
    const testCurrency = Currency.USD;
    const testResponseData = {};
    fetchRatesForCurrency.mockImplementationOnce(async () => testResponseData);

    const expectedActions = [
      { data: { currency: testCurrency }, type: ActionType.FETCH_RATES_REQUEST },
      {
        data: { currency: testCurrency, response: testResponseData },
        type: ActionType.FETCH_RATES_RESPONSE_SUCCESS,
      },
    ];
    const store = mockStore({ balances: {}, rates: {} });

    await store.dispatch(fetchRates(testCurrency));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('dispatches FETCH_RATES_RESPONSE_ERROR on request error', async () => {
    const testCurrency = Currency.USD;
    fetchRatesForCurrency.mockImplementationOnce(() => Promise.reject());

    const expectedActions = [
      { data: { currency: testCurrency }, type: ActionType.FETCH_RATES_REQUEST },
      { data: { currency: testCurrency }, type: ActionType.FETCH_RATES_RESPONSE_ERROR },
    ];
    const store = mockStore({ balances: {}, rates: {} });

    await store.dispatch(fetchRates(testCurrency));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('doesn\'t dispatch extions if rates for currency is fetching', async () => {
    const testResponseData = {};
    fetchRatesForCurrency.mockImplementationOnce(async () => testResponseData);

    const store = mockStore({
      balances: {},
      rates: {
        [Currency.USD]: {
          isFetching: true,
          isLoaded: false,
        }
      }
    });

    await store.dispatch(fetchRates(Currency.USD));
    expect(store.getActions().length).toEqual(0);
  });
});