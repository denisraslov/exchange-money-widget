import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { isMoneyStringValid, formatNumber, formatRate } from './utils';

describe('Utils', () => {
  it('checks money string right', () => {
    expect(isMoneyStringValid('12.')).toEqual(true);
    expect(isMoneyStringValid('12.12')).toEqual(true);
    expect(isMoneyStringValid('0.0')).toEqual(true);
    expect(isMoneyStringValid('0.')).toEqual(true);
    expect(isMoneyStringValid('0.0')).toEqual(true);
    expect(isMoneyStringValid('0.')).toEqual(true);
    expect(isMoneyStringValid('0.00')).toEqual(true);

    expect(isMoneyStringValid('.')).toEqual(false);
    expect(isMoneyStringValid('12.12345')).toEqual(false);
    expect(isMoneyStringValid('abc1')).toEqual(false);
  });

  it('formats number right', () => {
    expect(formatNumber(12.12)).toEqual('12.12');
    expect(formatNumber(12.12345)).toEqual('12.12');
    expect(formatNumber(1)).toEqual('1');
  });

  it('formats rate right', () => {
    expect(formatRate(12.12)).toEqual('12.12');
    expect(formatRate(12.12345)).toEqual('12.12');
    expect(formatRate(1)).toEqual('1');
  });
});