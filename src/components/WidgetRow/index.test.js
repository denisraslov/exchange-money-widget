import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import WidgetRow from '.';
import { Select, Form } from 'antd';
import MoneyInput from './../MoneyInput';
import { Currency } from './../../const/currency';

const testProps = {
  currency: Currency.USD,
  balance: 100,
  isSourceCurrency: false,
  isBalanceError: false,
  value: '10',
  isInputDisabled: false,
  onInputChange: () => {},
  onCurrencyChange: () => {},
};

describe('WidgetRow component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<WidgetRow {...testProps} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('calls onCurrencyChange when the currency is changed', () => {
    const onCurrencyChange = jest.fn();
    const wrapper = shallow(
      <WidgetRow
        {...testProps}
        onCurrencyChange={onCurrencyChange}
      />);

    const selectView = wrapper.find(Select);

    expect(selectView).toHaveLength(1);
    expect(selectView.props().onChange).toBeTruthy();

    selectView.props().onChange();

    expect(onCurrencyChange).toBeCalledTimes(1);
  });

  it('calls onInputChange when the input is changed', () => {
    const onInputChange = jest.fn();
    const wrapper = shallow(
      <WidgetRow
        {...testProps}
        onInputChange={onInputChange}
      />);

    const inputView = wrapper.find(MoneyInput);

    expect(inputView).toHaveLength(1);
    expect(inputView.props().onChange).toBeTruthy();

    inputView.props().onChange();

    expect(onInputChange).toBeCalledTimes(1);
  });

  it('renders right balance text', () => {
    const onCurrencyChange = jest.fn();
    const wrapper = shallow(
      <WidgetRow
        {...testProps}
        onCurrencyChange={onCurrencyChange}
      />);

    const formItemView = wrapper.find(Form.Item);

    expect(formItemView).toHaveLength(1);
    expect(formItemView.props().help).toEqual('You have 100 $');
  });

  it('renders error validateStatus on error', () => {
    const onCurrencyChange = jest.fn();
    const wrapper = shallow(
      <WidgetRow
        {...testProps}
        isBalanceError
      />);

    const formItemView = wrapper.find(Form.Item);

    expect(formItemView).toHaveLength(1);
    expect(formItemView.props().validateStatus).toEqual('error');
  });
});