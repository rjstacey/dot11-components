
export const AccessLevel = {
	Public: 0,
	Member: 1,
	SubgroupAdmin: 2,
	WGAdmin: 3
};

export const AccessLevelLabels = {
	[AccessLevel.Public]: 'Observer',
	[AccessLevel.Member]: 'Member',
	[AccessLevel.SubgroupAdmin]: 'Subgroup admin',
	[AccessLevel.WGAdmin]: 'WG admin'
};

export const displayAccessLevel = (value: number) => AccessLevelLabels[value] || 'Unknown';

export const AccessLevelOptions = Object.values(AccessLevel).map(value => ({value, label: AccessLevelLabels[value]}));

const LOGIN_STORAGE = 'User';

export type User = {
	SAPIN: number;
	Name: string;
	Email: string;
	Status: string;
	Token: any;
	Access: number;
	Permissions: string[];
}

export async function logout() {
	localStorage.removeItem(LOGIN_STORAGE);
	window.location.href = '/login?redirect=' + window.location.pathname;
	await new Promise(r => setTimeout(r, 1000));
	throw new Error('redirect to login failed');
}

export function getUser() {
	// Get user from local storage. This may fail if the browser has certain privacy settings.
	let user: User | undefined;
	try {
		const s = localStorage.getItem(LOGIN_STORAGE);
		if (s)
			user = JSON.parse(s);
	} catch (err) {
		/* ignore errors */
	}
	return user? Promise.resolve(user): Promise.reject(new Error('User account info not available'));
}
