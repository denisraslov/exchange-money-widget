import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Typography, Form, Select, Input } from 'antd';
import { Currency, SymbolByCurrency } from '../../const/currency';
import { formatNumber } from '../../utils/utils';
import MoneyInput from './../MoneyInput';
import styles from './index.module.css';

const { Option } = Select;
const { Text } = Typography;

const currencies = Object.keys(Currency);

function WidgetRow({
  value,
  currency,
  balance,
  isSourceCurrency,
  isBalanceError,
  isInputDisabled,
  className,
  onCurrencyChange,
  onInputChange,
}) {
  return (
    <div className={classNames(styles.widgetRow, className)}>
      <Form>
        <Text type="secondary">{isSourceCurrency ? 'From' : 'To'}</Text>
        <Form.Item
          validateStatus={isBalanceError ? 'error' : null}
          help={`You have ${SymbolByCurrency[currency]}${formatNumber(balance.toString())}`}
        >
          <Input.Group compact>
            <Select
              value={currency}
              onChange={onCurrencyChange}
              style={{ width: '30%' }}
            >
            {
              currencies.map((cur) => (
                <Option
                  key={cur}
                  value={cur}
                >{cur}</Option>
              ))
            }
            </Select>
            <MoneyInput
              style={{ width: '70%' }}
              onChange={onInputChange}
              value={value}
              disabled={isInputDisabled}
            />
          </Input.Group>
        </Form.Item>
      </Form>
    </div>
  );
}

WidgetRow.propTypes = {
  currency: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  isSourceCurrency: PropTypes.bool,
  isBalanceError: PropTypes.bool,
  isInputDisabled: PropTypes.bool,
  value: PropTypes.string,
  className: PropTypes.string,
  onInputChange: PropTypes.func,
  onCurrencyChange: PropTypes.func,
};

export default WidgetRow;
