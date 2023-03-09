import React from 'react';
import Input from './Input';

interface CheckboxProps extends React.ComponentProps<typeof Input> {
	indeterminate?: boolean;
};

const Checkbox = ({indeterminate = false, ...otherProps}: CheckboxProps) =>
	<Input type='checkbox' ref={el => el && (el.indeterminate = indeterminate)} {...otherProps}/>

export default Checkbox;
