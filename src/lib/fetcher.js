import {saveAs} from 'file-saver';

const methods = {};

const apiBaseUrl = '';
let jwtBearerToken;
let onUnauthorized;

methods.setAuth = (token, onUnauthorizedFunc) => {
	jwtBearerToken = token;
	onUnauthorized = onUnauthorizedFunc;
}

export function NetworkError(response, status) {
	this.name = 'NetworkError';
	this.status = status;
	this.response = response;
}
NetworkError.prototype = Error.prototype;

function tryParseJSON(json) {
	if (!json)
		return null;
	try {
		return JSON.parse(json);
	} catch (e) {
		throw new Error(`Failed to parse an expected JSON response: ${json}`);
	}
}

function getResponseBody(res) {
	const contentType = res.headers.get('content-type');
	if (contentType && contentType.indexOf('json') >= 0)
		return res.text().then(tryParseJSON);
	return res.text();
}

async function errHandler(res) {

	// Unauthorized
	if (res.status === 401 && onUnauthorized) {
		return onUnauthorized();
	}

	const body = await getResponseBody(res);

	throw new NetworkError(body || '', res.status);
}

methods.fetch = async (method, url, params) => {
	url = apiBaseUrl + url;

	const options = {method};

	if (params) {
		if (method === "GET")
			url += '?' + new URLSearchParams(params);
		else
			options.body = JSON.stringify(params);
	}

	options.headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	};

	if (jwtBearerToken)
		options.headers['Authorization'] = `Bearer ${jwtBearerToken}`;

	const res = await fetch(url, options);

	return res.ok? getResponseBody(res): errHandler(res);
}

["GET", "POST", "PUT", "DELETE", "PATCH"]
	.forEach(m => methods[m.toLowerCase()] = (...args) => methods.fetch(m, ...args));

methods.getFile = async (url, params) => {
	url = apiBaseUrl + url;
	if (params)
		url += '?' + new URLSearchParams(params);

	const options = {method: 'GET'};
	if (jwtBearerToken)
		options.headers = {'Authorization': `Bearer ${jwtBearerToken}`};

	const res = await fetch(url, options);

	if (res.ok) {
		let filename = 'download'
		const d = res.headers.get('content-disposition')
		if (d) {
			const m = d.match(/filename="(.*)"/i)
			if (m)
				filename = m[1];
		}
		saveAs(await res.blob(), filename);
		return filename;
	}

	return errHandler(res);
}

methods.postForFile = async (url, params, file) => {
	url = apiBaseUrl + url;

	const formData = new FormData();
	formData.append('params', JSON.stringify(params));
	formData.append('file', file);

	const options = {
		method: 'POST',
		body: formData
	};
	if (jwtBearerToken)
		options.headers = {'Authorization': `Bearer ${jwtBearerToken}`};

	const res = await fetch(url, options);

	if (res.ok) {
		let filename = 'download';
		const d = res.headers.get('content-disposition');
		if (d) {
			const m = d.match(/filename="(.*)"/i);
			if (m)
				filename = m[1];
		}
		saveAs(await res.blob(), filename);
		return filename;
	}

	return errHandler(res);
}

methods.postMultipart = async (url, params) => {
	url = apiBaseUrl + url;

	let formData = new FormData();
	for (let key of Object.keys(params))
		formData.append(key, params[key]);

	const options = {
		method: 'POST',
		body: formData
	};
	if (jwtBearerToken)
		options.headers = {'Authorization': `Bearer ${jwtBearerToken}`};

	const res = await fetch(url, options);

	return res.ok? res.json(): errHandler(res);
}

export default methods
