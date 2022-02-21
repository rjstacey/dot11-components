import PropTypes from 'prop-types';
import React from 'react';

const DropdownHandle = ({ isOpen, ...props }) =>
	<div
		className={`select-dropdown-handle`}
		{...props}
	>
		<svg style={{transform: isOpen? 'rotate(0deg)': 'rotate(180deg)'}} fill="currentColor" viewBox="0 0 40 40">
			<path d="M31 26.4q0 .3-.2.5l-1.1 1.2q-.3.2-.6.2t-.5-.2l-8.7-8.8-8.8 8.8q-.2.2-.5.2t-.5-.2l-1.2-1.2q-.2-.2-.2-.5t.2-.5l10.4-10.4q.3-.2.6-.2t.5.2l10.4 10.4q.2.2.2.5z" />
		</svg>
	</div>

DropdownHandle.propTypes = {
	isOpen: PropTypes.bool.isRequired
}

export default DropdownHandle;
