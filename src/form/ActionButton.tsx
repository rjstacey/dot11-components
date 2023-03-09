import React from 'react';
import {Icon} from '../icons';
import Button from './Button';

type ActionButtonProps = {
	name?: string;
	label?: string;
	[ index: string ]: any;
}

const ActionButton = ({name, label, ...rest}: ActionButtonProps) => 
	<Button {...rest}>
		{name? <Icon type={name} />: label}
	</Button>

export default ActionButton;
