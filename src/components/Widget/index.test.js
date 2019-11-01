import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Typography, Button } from 'antd';
import Widget from '.';
import WidgetRow from './../WidgetRow';
import { Currency } from './../../const/currency';

const { Text } = Typography;

const testProps = {
  onExchangeClick: () => {},
  onValueFromChange: () => {},
  onValueToChange: () => {},
  onCurrencyFromChange: () => {},
  onCurrencyToChange: () => {},
  balanceFrom: 100,
  balanceTo: 100,
  currencyFrom: Currency.EUR,
  currencyTo: Currency.GBP,
  valueFrom: '100',
  valueTo: '200',
  rate: 2.123,
};

describe('Widget component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Widget {...testProps} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('passes isBalanceError to first WidgetRow on balance error', async () => {
    const wrapper = shallow(
      <Widget
        {...testProps}
        balanceFrom={100}
        valueFrom={'101'}
      />);

    const view1 = wrapper.find(WidgetRow).first();

    expect(view1.props().isBalanceError).toEqual(true);
  });

  it('renders rate if currencies are not the same', async () => {
    const wrapper = shallow(
      <Widget
        {...testProps}
        currencyFrom={Currency.EUR}
        currencyTo={Currency.GBP}
      />);

    expect(wrapper.find('.rate')).toHaveLength(1);
  });

  it('renders rate right if rate is not undefined', async () => {
    const wrapper = shallow(
      <Widget
        {...testProps}
      />);

    const rateView = wrapper.find('.rate');
    expect(rateView).toHaveLength(1);

    const rateTextView = rateView.find(Text);
    expect(rateTextView).toHaveLength(1);

    expect(rateTextView.childAt(0).text()).toEqual('€1 = £2.12');
  });

  it('renders loader if rate is undefined', async () => {
    const wrapper = shallow(
      <Widget
        {...testProps}
        rate={undefined}
      />);

    const rateView = wrapper.find('.rate');
    expect(rateView).toHaveLength(1);

    const rateTextView = rateView.find(Text);
    expect(rateTextView).toHaveLength(1);

    expect(rateTextView.childAt(0).text()).toEqual('Rate is loading...');
  });

  it('does not render rate if currencies are the same', async () => {
    const wrapper = shallow(
      <Widget
        {...testProps}
        currencyFrom={Currency.EUR}
        currencyTo={Currency.EUR}
      />);

    expect(wrapper.find('.rate')).toHaveLength(0);
  });

  it('disables button and second input if currencies are the same', async () => {
    const wrapper = shallow(
      <Widget
        {...testProps}
        currencyFrom={Currency.EUR}
        currencyTo={Currency.EUR}
      />);

    const buttonView = wrapper.find(Button);

    expect(buttonView).toHaveLength(1);
    expect(buttonView.props().disabled).toEqual(true);

    const rowView = wrapper.find(WidgetRow).last();

    expect(rowView.props().isInputDisabled).toEqual(true);
  });

  it('disables button if rate is undefined', async () => {
    const wrapper = shallow(
      <Widget
        {...testProps}
        rate={undefined}
      />);

    const buttonView = wrapper.find(Button);

    expect(buttonView).toHaveLength(1);
    expect(buttonView.props().disabled).toEqual(true);
  });

  it('disables button if valueFrom is empty', async () => {
    const wrapper = shallow(
      <Widget
        {...testProps}
        valueFrom=""
      />);

    const buttonView = wrapper.find(Button);

    expect(buttonView).toHaveLength(1);
    expect(buttonView.props().disabled).toEqual(true);
  });

  it('disables button if valueTo is empty', async () => {
    const wrapper = shallow(
      <Widget
        {...testProps}
        valueTo=""
      />);

    const buttonView = wrapper.find(Button);

    expect(buttonView).toHaveLength(1);
    expect(buttonView.props().disabled).toEqual(true);
  });

  it('calls onExchangeClick when the button is clicked', () => {
    const onExchange = jest.fn();
    const wrapper = shallow(
      <Widget
        {...testProps}
        onExchangeClick={onExchange}
      />);

    const buttonView = wrapper.find(Button);

    expect(buttonView).toHaveLength(1);
    expect(buttonView.props().onClick).toBeTruthy();

    buttonView.props().onClick();

    expect(onExchange).toBeCalledTimes(1);
  });
});