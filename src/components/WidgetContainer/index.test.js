import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { NotConnectedWidgetContainer as WidgetContainer } from '.';
import Widget from './../Widget';
import { Currency } from './../../const/currency';

const testProps = {
  exchangeCurrency: () => {},
  fetchRates: () => {},
  ratesFetchTimeout: 1000,
  balances: {
    [Currency.USD]: 150,
    [Currency.GBP]: 200,
  },
  rates: {
    [Currency.USD]: {
      isLoaded: true,
      rates: {
        [Currency.GBP]: 0.5
      }
    }
  }
};

describe('WidgetContainer component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<WidgetContainer {...testProps} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('calls fetchRates 2 times in needed time', async () => {
    const timeout = 1000;
    const fetchFunc = jest.fn();
    shallow(
      <WidgetContainer {...testProps} fetchRates={fetchFunc} />
    );
    await sleep(timeout * 1.5);

    expect(fetchFunc).toHaveBeenCalledTimes(2);
  });

  it('sets valueTo according to the rate if the valueFrom changes', () => {
    const valueFrom = '10';
    const valueTo = '5';

    const wrapper = shallow(
      <WidgetContainer {...testProps} />
    );

    const widgetView1 = wrapper.find(Widget);
    expect(widgetView1).toHaveLength(1);

    widgetView1.props().onValueFromChange(valueFrom);

    const widgetView2 = wrapper.find(Widget);
    expect(widgetView2.props().valueTo).toEqual(valueTo);
  });

  it('sets valueFrom according to the rate if the valueTo changes', () => {
    const valueFrom = '20';
    const valueTo = '10';

    const wrapper = shallow(
      <WidgetContainer {...testProps} />
    );

    const widgetView1 = wrapper.find(Widget);
    expect(widgetView1).toHaveLength(1);

    widgetView1.props().onValueToChange(valueTo);

    const widgetView2 = wrapper.find(Widget);
    expect(widgetView2.props().valueFrom).toEqual(valueFrom);
  });

  it('updates valueTo if currencyTo changes', () => {
    const currencyTo = Currency.EUR;
    const valueFrom = '10';
    const valueTo = '20';
    const rates = {
      [Currency.USD]: {
        isLoaded: true,
        rates: {
          [Currency.EUR]: 2,
        },
      },
    };
    const wrapper = shallow(
      <WidgetContainer {...testProps} rates={rates}/>
    );

    const widgetView1 = wrapper.find(Widget);
    expect(widgetView1).toHaveLength(1);
    widgetView1.props().onValueFromChange(valueFrom);

    const widgetView2 = wrapper.find(Widget);
    expect(widgetView2).toHaveLength(1);
    widgetView2.props().onCurrencyToChange(currencyTo);

    const widgetView3 = wrapper.find(Widget);
    expect(widgetView3).toHaveLength(1);
    expect(widgetView3.props().valueTo).toEqual(valueTo);
  });

  it('fetches rates if the currencyFrom changes', async () => {
    const currencyFrom = Currency.GBP;
    const fetchFunc = jest.fn();
    const wrapper = shallow(
      <WidgetContainer
        {...testProps}
        fetchRates={fetchFunc}
      />
    );

    fetchFunc.mockClear();

    const widgetView1 = wrapper.find(Widget);
    expect(widgetView1).toHaveLength(1);
    widgetView1.props().onCurrencyFromChange(currencyFrom);

    expect(fetchFunc).toBeCalledTimes(1);
  });

  it('updates valueTo if rates change', () => {
    const valueFrom = '100';
    const valueTo1 = '100';
    const valueTo2 = '200';
    const rates1 = {
      [Currency.USD]: {
        isFetching: false,
        isLoaded: true,
        rates: {
          [Currency.GBP]: 1,
        },
      },
    };
    const rates2 = {
      [Currency.USD]: {
        isFetching: false,
        isLoaded: true,
        rates: {
          [Currency.GBP]: 2,
        },
      },
    };

    const wrapper = shallow(
      <WidgetContainer
        {...testProps}
        rates={rates1}
      />
    );

    const widgetView1 = wrapper.find(Widget);
    expect(widgetView1).toHaveLength(1);
    widgetView1.props().onValueFromChange(valueFrom);

    const widgetView2 = wrapper.find(Widget);
    expect(widgetView2.props().valueTo).toEqual(valueTo1);

    wrapper.setProps({ rates: rates2 });
    const widgetView3 = wrapper.find(Widget);
    expect(widgetView3.props().valueTo).toEqual(valueTo2);
  });

  it('calls onExchange with the right values', () => {
    const valueFrom = '10';
    const rate = 2;
    const currencyFrom = Currency.EUR;
    const currencyTo = Currency.GBP;
    const balances = {
      [Currency.EUR]: 100,
    };
    const rates = {
      [Currency.GBP]: {
        isFetching: false,
        isLoaded: true,
        rates: {
          [Currency.EUR]: rate,
        },
      },
    };
    const onExchange = jest.fn();
    const wrapper = shallow(
      <WidgetContainer
        {...testProps}
        balances={balances}
        rates={rates}
        exchangeCurrency={onExchange}
      />
    );

    const widgetView1 = wrapper.find(Widget);
    expect(widgetView1).toHaveLength(1);
    widgetView1.props().onCurrencyFromChange(currencyFrom);

    const widgetView2 = wrapper.find(Widget);
    expect(widgetView2).toHaveLength(1);
    widgetView2.props().onCurrencyToChange(currencyTo);

    const widgetView3 = wrapper.find(Widget);
    expect(widgetView3).toHaveLength(1);
    widgetView3.props().onValueFromChange(valueFrom);

    const widgetView4 = wrapper.find(Widget);
    expect(widgetView4).toHaveLength(1);
    widgetView4.props().onExchangeClick();

    expect(onExchange).toBeCalledTimes(1);
    expect(onExchange).toHaveBeenLastCalledWith({
      currencyFrom,
      currencyTo,
      valueFrom,
    });
  });

  it('clears values after onExchange call', () => {
    const valueFrom = '10';
    const currencyFrom = Currency.EUR;
    const currencyTo = Currency.GBP;

    const onExchange = jest.fn();
    const wrapper = shallow(
      <WidgetContainer
        {...testProps}
        exchangeCurrency={onExchange}
      />
    );

    const widgetView1 = wrapper.find(Widget);
    expect(widgetView1).toHaveLength(1);
    widgetView1.props().onCurrencyFromChange(currencyFrom);

    const widgetView2 = wrapper.find(Widget);
    expect(widgetView2).toHaveLength(1);
    widgetView2.props().onCurrencyToChange(currencyTo);

    const widgetView3 = wrapper.find(Widget);
    expect(widgetView3).toHaveLength(1);
    widgetView3.props().onValueFromChange(valueFrom);

    const widgetView4 = wrapper.find(Widget);
    expect(widgetView4).toHaveLength(1);
    widgetView4.props().onExchangeClick();

    const widgetView5 = wrapper.find(Widget);
    expect(widgetView5).toHaveLength(1);

    expect(widgetView5.props().valueFrom).toEqual('');
    expect(widgetView5.props().valueTo).toEqual('');
  });

  it('clears valueFrom if rates are being loaded', () => {
    const valueTo = '10';

    const wrapper = shallow(
      <WidgetContainer
        {...testProps}
        rates={{
          [Currency.USD]: {
            isLoaded: false,
            isLoading: true,
          }
        }}
      />
    );

    const widgetView1 = wrapper.find(Widget);
    expect(widgetView1).toHaveLength(1);

    widgetView1.props().onValueToChange(valueTo);

    const widgetView2 = wrapper.find(Widget);
    expect(widgetView2.props().valueFrom).toEqual('');
  });

  it('clears valueTo if rates are being loaded', () => {
    const valueFrom = '10';

    const wrapper = shallow(
      <WidgetContainer
        {...testProps}
        rates={{
          [Currency.USD]: {
            isLoaded: false,
            isLoading: true,
          }
        }}
      />
    );

    const widgetView1 = wrapper.find(Widget);
    expect(widgetView1).toHaveLength(1);

    widgetView1.props().onValueFromChange(valueFrom);

    const widgetView2 = wrapper.find(Widget);
    expect(widgetView2.props().valueTo).toEqual('');
  });

  it('passes right initial props to the widget', () => {
    const wrapper = shallow(
      <WidgetContainer
        {...testProps}
      />
    );

    const widgetView = wrapper.find(Widget);
    expect(widgetView).toHaveLength(1);

    expect(widgetView.props().valueFrom).toEqual('');
    expect(widgetView.props().valueTo).toEqual('');
    expect(widgetView.props().currencyFrom).toEqual(Currency.USD);
    expect(widgetView.props().currencyTo).toEqual(Currency.GBP);
    expect(widgetView.props().rate).toEqual(0.5);
  });
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}