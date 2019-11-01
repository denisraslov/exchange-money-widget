export function getBalanceForCurrency(state, currency) {
  return state[currency] || 0;
}

export function roundSumResult(number) {
  return Number(number.toFixed(2));
}