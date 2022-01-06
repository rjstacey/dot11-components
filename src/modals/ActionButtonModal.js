import React from 'react';
import PropTypes from 'prop-types';
import {AppModal} from '.';

import {Icon} from '../icons';
import {Button} from '../form';

const ActionButtonModal = ({name, label, title, disabled, children, onRequestOpen, onRequestClose, ...rest}) => {
	const [isOpen, setOpen] = React.useState(false);

	const open = () => {
		if (onRequestOpen)
			onRequestOpen();
		setOpen(true);
	}

	const close = () => {
		if (onRequestClose)
			onRequestClose();
		setOpen(false);
	}

	return (
		<>
			<Button
				name={name}
				label={label}
				title={title}
				disabled={disabled}
				onClick={isOpen? close: open}
			>
				{label?
					label:
					<Icon
						type={name}
					/>}
			</Button>
			<AppModal
				isOpen={isOpen}
				onRequestClose={close}
				{...rest}
			>
				{React.Children.map(children,
					child => React.isValidElement(child)? React.cloneElement(child, {isOpen, close}): child
				)}
			</AppModal>
		</>
	)
}

ActionButtonModal.propTypes = {
	name: PropTypes.string,
	label: PropTypes.string,
	title: PropTypes.string,
	disabled: PropTypes.bool,
	onRequestOpen: PropTypes.func,
	onRequestClose: PropTypes.func,
}

export default ActionButtonModal;