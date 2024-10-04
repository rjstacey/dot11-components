import * as React from "react";
import { Button } from "../form";

import { Dropdown, DropdownRendererProps } from "../dropdown";
import { loginAndReturn, User } from "../lib";

function SignOutForm({
	user,
	children,
	onSignout,
	methods,
}: {
	user: User;
	children?: React.ReactNode;
	onSignout?: () => void;
} & DropdownRendererProps) {
	function submit() {
		if (onSignout) onSignout();
		else loginAndReturn();
		methods.close();
	}

	return (
		<>
			<label>{user.Name}</label>
			<label>{user.SAPIN}</label>
			<label>{user.Email}</label>
			{children}
			<Button value="Sign Out" onClick={submit}>
				Sign out
			</Button>
		</>
	);
}

const Account = ({
	user,
	children,
	onSignout,
}: {
	user: User;
	children?: React.ReactNode;
	onSignout?: () => void;
}) => (
	<Dropdown
		label={`${user.Name} (${user.SAPIN})`}
		dropdownRenderer={(args) => (
			<SignOutForm
				user={user}
				children={children}
				onSignout={onSignout}
				{...args}
			/>
		)}
	/>
);

export default Account;
