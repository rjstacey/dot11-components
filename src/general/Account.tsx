import React from 'react';
import { Button } from '../form';

import { Dropdown, DropdownRendererProps } from '../dropdown';
import { logout, User } from '../lib';

const SignOutForm = ({user, children, methods}: {user: User; children?: React.ReactNode} & DropdownRendererProps) => {

	const submit = () => {
		logout();
		methods.close();
	}

	return (
		<>
			<label>{user.Name}</label>
			<label>{user.SAPIN}</label>
			<label>{user.Email}</label>
			{children}
			<Button value="Sign Out" onClick={submit}>Sign out</Button>
		</>
	)
}

const Account = ({user, children}: {user: User; children?: React.ReactNode}) =>
	<Dropdown
		label={`${user.Name} (${user.SAPIN})`}
		dropdownRenderer={(args) => <SignOutForm user={user} children={children} {...args} />}
	/>

export default Account
