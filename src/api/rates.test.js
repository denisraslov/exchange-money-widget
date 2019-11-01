import { Currency } from '../const/currency';
import { fetchRatesForCurrency } from './rates';

describe('Rates API', () => {
  it('uses right url for fetching', async () => {
    const mockFetchPromise = Promise.resolve({
      ok: true,
      json: () => undefined,
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    await fetchRatesForCurrency(Currency.EUR);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch)
      .toHaveBeenLastCalledWith('https://api.ratesapi.io/latest?base=EUR');

    await fetchRatesForCurrency(Currency.GBP);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch)
      .toHaveBeenLastCalledWith('https://api.ratesapi.io/latest?base=GBP');

      global.fetch.mockRestore();
  });

  it('resolves with response json', async () => {
    const mockSuccessResponse = 'success';
    const mockFetchPromise = Promise.resolve({
      ok: true,
      json: () => mockSuccessResponse,
    });
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => mockFetchPromise);

    const apiPromise = fetchRatesForCurrency(Currency.USD);
    await expect(apiPromise).resolves.toBe(mockSuccessResponse);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    global.fetch.mockRestore();
  });

  it('rejects on response error', async () => {
    const mockFetchPromise = Promise.resolve({ ok: false });
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => mockFetchPromise);

    const apiPromise = fetchRatesForCurrency(Currency.USD);
    await expect(apiPromise).rejects.toHaveProperty('ok', false);

    global.fetch.mockRestore();
  });
});