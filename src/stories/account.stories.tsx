import React from "react";

import { Account } from "../general";
import { getUser, type User } from "../lib";

export default {
	title: "Account",
	component: Account,
};

const defaultUser: User = {
	Name: "Fred Flintstone",
	SAPIN: 112233,
	Email: "fred.flintstone@pleistocene.info",
	Token: "",
};

export const Signout = (args) => (
	<div
		style={{
			display: "flex",
			justifyContent: "space-between",
		}}
	>
		<Account {...args} />
		<Account {...args} />
	</div>
);

export function GetAccount() {
	const [user, setUser] = React.useState<User>();

	React.useEffect(() => {
		localStorage.setItem("User", JSON.stringify(defaultUser));
		getUser()
			.then((user) => {
				console.log("got user", user);
				setUser(user);
			})
			.catch((error) => {
				console.warn("failed to get user", error);
				setUser(error.toString());
			});
	}, []);

	console.log(typeof user, user);
	if (user === undefined) return <span>Nothing</span>;

	if (typeof user === "string") return <span>{user}</span>;

	return <div>{JSON.stringify(user)}</div>;
}

Signout.args = {
	user: defaultUser,
};
