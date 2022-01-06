import React from 'react';
import {Icon} from '../icons';
import Button from './Button';

const ActionButton = ({name, label, ...rest}) => 
	<Button {...rest}>
		{name? <Icon type={name} />: label}
	</Button>

export default ActionButton;
