import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from 'antd';
import WidgetRow from './../WidgetRow';
import { SymbolByCurrency } from '../../const/currency';
import { formatRate } from '../../utils/utils';
import styles from './index.module.css';

const { Text } = Typography;

function Widget({
  onExchangeClick,
  onValueFromChange,
  onValueToChange,
  onCurrencyFromChange,
  onCurrencyToChange,
  balanceFrom,
  balanceTo,
  currencyFrom,
  currencyTo,
  valueFrom,
  valueTo,
  rate,
}) {
  const isBalanceError = Number(valueFrom) > Number(balanceFrom);
  const areCurrenciesTheSame = currencyFrom === currencyTo;
  const isExchangeButtonDisabled = isBalanceError
    || !rate
    || !valueFrom
    || !valueTo
    || areCurrenciesTheSame;

  return (
    <div className={styles.widget}>
      <WidgetRow
        isSourceCurrency
        balance={balanceFrom}
        currency={currencyFrom}
        value={valueFrom}
        onCurrencyChange={onCurrencyFromChange}
        onInputChange={onValueFromChange}
        isBalanceError={isBalanceError}
      />
      <WidgetRow
        className={styles.secondRow}
        isSourceCurrency={false}
        balance={balanceTo}
        currency={currencyTo}
        value={valueTo}
        sourceCurrency={currencyFrom}
        isInputDisabled={areCurrenciesTheSame}
        onCurrencyChange={onCurrencyToChange}
        onInputChange={onValueToChange}
      />
      {
        !areCurrenciesTheSame &&
          <div className={styles.rate}>
            <Text>
              {
                rate ?
                  `${SymbolByCurrency[currencyFrom]}1 = ${SymbolByCurrency[currencyTo]}${formatRate(rate)}` :
                  `Rate is loading...`
              }
            </Text>
          </div>
      }
      <div className={styles.buttonWrapper}>
        <Button
          type="primary"
          onClick={onExchangeClick}
          disabled={isExchangeButtonDisabled}
        >
          Exchange
        </Button>
      </div>
    </div>
  );
}

Widget.propTypes = {
  onExchangeClick: PropTypes.func,
  onValueFromChange: PropTypes.func,
  onValueToChange: PropTypes.func,
  onCurrencyFromChange: PropTypes.func,
  onCurrencyToChange: PropTypes.func,
  balanceFrom: PropTypes.number.isRequired,
  balanceTo: PropTypes.number.isRequired,
  currencyFrom: PropTypes.string.isRequired,
  currencyTo: PropTypes.string.isRequired,
  valueFrom: PropTypes.string,
  valueTo: PropTypes.string,
  rate: PropTypes.number,
};

export default Widget;
