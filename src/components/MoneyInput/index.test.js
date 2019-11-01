import React from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'antd';
import MoneyInput from '.';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MoneyInput onChange={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('calls onChange with correct value', () => {
  const onChange = jest.fn();
  const currencyInput = shallow(<MoneyInput onChange={onChange} />);

  const input = currencyInput.find(Input);
  expect(input).toHaveLength(1);

  expect(input.props().onChange).toBeTruthy();
  input.props().onChange({ target: { value: 'abc' } });
  expect(onChange).toHaveBeenCalledTimes(0);

  expect(input.props().onChange).toBeTruthy();
  input.props().onChange({ target: { value: '12.12345' } });
  expect(onChange).toHaveBeenCalledTimes(0);

  expect(input.props().onChange).toBeTruthy();
  input.props().onChange({ target: { value: '0.' } });
  expect(onChange).toHaveBeenCalledTimes(1);

  expect(input.props().onChange).toBeTruthy();
  input.props().onChange({ target: { value: '0.1' } });
  expect(onChange).toHaveBeenCalledTimes(2);

  expect(input.props().onChange).toBeTruthy();
  input.props().onChange({ target: { value: '0.12' } });
  expect(onChange).toHaveBeenCalledTimes(3);
});