
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

export const displayAccessLevel = (value) => AccessLevelLabels[value] || 'Unknown';

export const AccessLevelOptions = Object.values(AccessLevel).map(value => ({value, label: AccessLevelLabels[value]}));

const LOGIN_STORAGE = 'User';

export async function logout() {
	localStorage.removeItem(LOGIN_STORAGE);
	window.location = '/login?redirect=' + window.location.pathname;
	await new Promise(r => setTimeout(r, 1000));
	throw new Error('redirect to login failed');
}

export function getUser() {
	// Get user from local storage. This may fail if the browser has certain privacy settings.
	let user;
	try {
		user = JSON.parse(localStorage.getItem(LOGIN_STORAGE))
	} catch (err) {
		/* ignore errors */
	}
	return user? Promise.resolve(user): Promise.reject(new Error('User account info not available'));
}
