import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { isMoneyStringValid } from './../../utils/utils';

const MoneyInput = ({ onChange: onChangeProp, ...restProps }) => {
  const onChange = React.useCallback(
    (e) => {
      const value = e.target.value;

      if (value && !isMoneyStringValid(value)) {
        return;
      }

      onChangeProp(value);
    },
    [onChangeProp],
  );

  return (
    <Input
      onChange={onChange}
      {...restProps}
    />
  );
};

MoneyInput.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default MoneyInput;