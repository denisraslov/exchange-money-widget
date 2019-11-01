export function formatNumber(value) {
  return (Math.round(value * 100) / 100).toString();
}

export function isMoneyStringValid(value) {
  return /^\d+(?:\.\d{0,2})?$/g.test(value);
}

export function formatRate(value) {
  return formatNumber(value);
}