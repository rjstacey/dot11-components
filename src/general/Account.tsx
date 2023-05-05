import React from 'react';
import {Button} from '../form';

import { Dropdown, DropdownRendererProps } from '../dropdown';
import {logout, AccessLevelLabels} from '../lib';

type User = {
	Name: string;
	SAPIN: number;
	Username: string;
	Access: number;
}

type SignOutFormProps = {
	user: User;
} & DropdownRendererProps;

const SignOutForm = ({user, methods}: SignOutFormProps) => {

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

type AccountProps = {
	user: User;
};

const Account = ({user}: AccountProps) =>
	<Dropdown
		label={`${user.Name} (${user.SAPIN})`}
		dropdownRenderer={(args) => <SignOutForm user={user} {...args} />}
	/>

export default Account
