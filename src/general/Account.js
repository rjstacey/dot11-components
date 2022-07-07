import PropTypes from 'prop-types';
import React from 'react';
import {Button} from '../form';

import Dropdown from '../dropdown';
import {logout, AccessLevelLabels} from '../lib';


const SignOutForm = ({user, methods}) => {

	const submit = () => {
		logout();
		methods.close();
	}

	const accessLabel = AccessLevelLabels[user.Access] || 'Unknown';

	return (
		<>
			<label>{user.Name}</label>
			<label>{user.SAPIN}</label>
			<label>{user.Username}</label>
			<label>{accessLabel}</label>
			<Button value="Sign Out" onClick={submit}>Sign out</Button>
		</>
	)
}

const Account = ({user}) =>
	<Dropdown
		label={`${user.Name} (${user.SAPIN})`}
		dropdownRenderer={(args) => <SignOutForm user={user} {...args} />}
	/>

Account.propTypes = {
	user: PropTypes.object.isRequired
}

export default Account
