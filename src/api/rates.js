function getRatesUrl(currency) {
  return `https://api.ratesapi.io/latest?base=${currency}`;
}

export const fetchRatesForCurrency = (currency) => {
  return fetch(getRatesUrl(currency))
    .then((response) => {
      if (!response.ok) {
        throw response;
      }

      return response.json();
    });
};