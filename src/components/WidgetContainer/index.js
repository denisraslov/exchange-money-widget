import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Widget from './../Widget';
import { exchangeCurrency } from './../../data/balances/actions';
import { getBalanceForCurrency } from './../../data/balances/utils';
import { fetchRates } from './../../data/rates/actions';
import { Currency } from './../../const/currency';
import { formatNumber } from './../../utils/utils';

const DEFAULT_RATES_FETCH_INTERVAL_MS = 10000;

class WidgetContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      valueFrom: '',
      valueTo: '',
      currencyFrom: Currency.USD,
      currencyTo: Currency.GBP,
    };
  }

  componentDidMount() {
    this.fetchRates();
  }

  componentDidUpdate(
    prevProps,
    prevState,
  ) {
    const { rates } = this.props;
    const { currencyFrom, valueFrom } = this.state;

    if (currencyFrom !== prevState.currencyFrom) {
      this.fetchRates();
    }

    if (rates !== prevProps.rates) {
      this.setValueFrom(valueFrom);
    }
  }

  componentWillUnmount() {
    this.clearRatesFetchTimeout();
  }

  fetchRates() {
    const { fetchRates, ratesFetchTimeout } = this.props;
    const { currencyFrom } = this.state;

    fetchRates(currencyFrom);

    this.clearRatesFetchTimeout();

    this.ratesFetchIntervalId = setInterval(() => {
      fetchRates(currencyFrom);
    }, ratesFetchTimeout);
  }

  clearRatesFetchTimeout() {
    clearInterval(this.ratesFetchIntervalId);
  }

  onExchangeClick = () => {
    const { currencyFrom, currencyTo, valueFrom } = this.state;

    this.props.exchangeCurrency({
      currencyFrom,
      currencyTo,
      valueFrom,
    });
    this.setState({
      valueFrom: '',
      valueTo: '',
    });
  };

  setCurrencyFrom = (currencyFrom) => {
    this.setState({
      currencyFrom,
      valueTo: '',
    });
  }

  setCurrencyTo = (currencyTo) => {
    this.setState({
      currencyTo
    }, () => {
      this.setValueFrom(this.state.valueFrom);
    });
  }

  setValueFrom = (valueFrom) => {
    const rate = this.getRateValue();

    this.setState({
      valueFrom,
      valueTo: rate && valueFrom ? formatNumber(valueFrom * rate).toString() : '',
    });
  }

  setValueTo = (valueTo) => {
    const rate = this.getRateValue();

    this.setState({
      valueTo,
      valueFrom: rate && valueTo ? formatNumber(valueTo / rate).toString() : '',
    });
  }

  getRateValue() {
    const { rates } = this.props;
    const { currencyFrom, currencyTo } = this.state;

    const currencyRate = rates[currencyFrom];
    const isRateLoaded = currencyRate && currencyRate.isLoaded;

    if (isRateLoaded) {
      return currencyRate.rates[currencyTo];
    }
  }

  render() {
    const { balances } = this.props;
    const { currencyFrom, currencyTo, valueFrom, valueTo } = this.state;

    return (
      <Widget
        onExchangeClick={this.onExchangeClick}
        currencyFrom={currencyFrom}
        currencyTo={currencyTo}
        balanceFrom={getBalanceForCurrency(balances, currencyFrom)}
        balanceTo={getBalanceForCurrency(balances, currencyTo)}
        valueFrom={valueFrom}
        valueTo={valueTo}
        onCurrencyFromChange={this.setCurrencyFrom}
        onCurrencyToChange={this.setCurrencyTo}
        onValueFromChange={this.setValueFrom}
        onValueToChange={this.setValueTo}
        rate={this.getRateValue()}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    balances: state.balances,
    rates: state.rates,
  };
};

const mapDispatchToProps = {
  exchangeCurrency,
  fetchRates,
};

WidgetContainer.defaultProps = {
  ratesFetchTimeout: DEFAULT_RATES_FETCH_INTERVAL_MS,
};

WidgetContainer.propTypes = {
  balances: PropTypes.object.isRequired,
  rates: PropTypes.object.isRequired,
  ratesFetchTimeout: PropTypes.number,
  exchangeCurrency: PropTypes.func.isRequired,
  fetchRates: PropTypes.func.isRequired,
};

export const NotConnectedWidgetContainer = WidgetContainer;

export default connect(mapStateToProps, mapDispatchToProps)(WidgetContainer);