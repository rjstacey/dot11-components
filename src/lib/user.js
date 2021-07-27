import fetcher from './fetcher'

export const AccessLevel = {
	Public: 0,
	Member: 1,
	SubgroupAdmin: 2,
	WGAdmin: 3
};

export const AccessLevelOptions = [
	{value: AccessLevel.Public,			label: 'Public'},
	{value: AccessLevel.Member,			label: 'Member'},
	{value: AccessLevel.SubgroupAdmin,	label: 'Subgroup Admin'},
	{value: AccessLevel.WGAdmin,		label: 'WG Admin'}
];

const LOGIN_STORAGE = 'User';

export function userInit() {
	// Get user from local storage. This may fail if the browser has certain privacy settings.
	let user;
	try {user = JSON.parse(localStorage.getItem(LOGIN_STORAGE))} catch (err) {/* ignore errors */}
	if (user && user.Token)
		fetcher.setJWT(user.Token);
	return user;
}

export function logout() {
	localStorage.removeItem('User');
	window.location = '/login?redirect=' + window.location.pathname;
}
