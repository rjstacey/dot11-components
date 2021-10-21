import React from 'react'
import Input from './Input'

const Checkbox = ({indeterminate, ...otherProps}) =>
	<Input type='checkbox' ref={el => el && (el.indeterminate = indeterminate)} {...otherProps}/>

export default Checkbox;
