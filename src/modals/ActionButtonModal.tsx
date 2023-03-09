import React from 'react';
import {AppModal} from '.';

import {Icon} from '../icons';
import {Button} from '../form';

interface ActionButtonModalProps {
	name?: string;
	label?: string;
	title?: string;
	disabled?: boolean;
	onRequestOpen?: () => void;
	onRequestClose?: () => void;
	children?: React.ReactNode;
	rest: React.ComponentPropsWithoutRef<typeof AppModal>;
}

export type ChildProps = {
	isOpen: boolean;
	close: () => void;
}

function ActionButtonModal({
	name,
	label,
	title,
	disabled,
	children,
	onRequestOpen,
	onRequestClose,
	...rest
}: ActionButtonModalProps) {
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
					child => React.isValidElement(child)? React.cloneElement(child as React.ReactElement<ChildProps>, {isOpen, close}): child
				)}
			</AppModal>
		</>
	)
}

export default ActionButtonModal;