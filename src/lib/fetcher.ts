import { saveAs } from "file-saver";

type Methods = {
	[key: string]: Function;
};

const methods: Methods = {};

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const apiBaseUrl = "";
let jwtBearerToken: string;
let onUnauthorized: () => void;

methods.setAuth = (token: string, onUnauthorizedFunc: () => void) => {
	jwtBearerToken = token;
	onUnauthorized = onUnauthorizedFunc;
};

export class NetworkError extends Error {
	public status: number;
	public response: Response;

	constructor(response: Response, status: number) {
		super("Network Error");
		this.status = status;
		this.response = response;

		Object.setPrototypeOf(this, NetworkError.prototype);
	}
}

function tryParseJSON(json: string | undefined) {
	if (!json) return null;
	try {
		return JSON.parse(json);
	} catch (e) {
		throw new Error(`Failed to parse an expected JSON response: ${json}`);
	}
}

function getResponseBody(res: Response): Promise<any> {
	const contentType = res.headers.get("content-type");
	if (contentType && contentType.indexOf("json") >= 0)
		return res.text().then(tryParseJSON);
	return res.text();
}

async function errHandler(res: Response) {
	// Unauthorized
	if (res.status === 401 && onUnauthorized) {
		return onUnauthorized();
	}

	const body = await getResponseBody(res);

	throw new NetworkError(body || "", res.status);
}

function urlParams(params: Record<string, any>) {
	let p = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (Array.isArray(value)) value.forEach((v) => p.append(key + "[]", v));
		else p.append(key, value);
	});
	return p.toString();
}

methods.fetch = async (
	method: Method,
	url: string,
	params: Record<string, any>
) => {
	url = apiBaseUrl + url;

	const options: RequestInit = { method };

	if (params) {
		if (method === "GET") url += "?" + urlParams(params);
		else options.body = JSON.stringify(params);
	}

	options.headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
	};

	if (jwtBearerToken)
		options.headers["Authorization"] = `Bearer ${jwtBearerToken}`;

	const res = await fetch(url, options);

	return res.ok ? getResponseBody(res) : errHandler(res);
};

["GET", "POST", "PUT", "DELETE", "PATCH"].forEach(
	(m) => (methods[m.toLowerCase()] = (...args) => methods.fetch(m, ...args))
);

methods.getFile = async (url: string, params: Record<string, any>) => {
	url = apiBaseUrl + url;
	if (params) url += "?" + urlParams(params);

	const options: RequestInit = { method: "GET" };
	if (jwtBearerToken)
		options.headers = { Authorization: `Bearer ${jwtBearerToken}` };

	const res = await fetch(url, options);

	if (res.ok) {
		let filename = "download";
		const d = res.headers.get("content-disposition");
		if (d) {
			const m = d.match(/filename="(.*)"/i);
			if (m) filename = m[1];
		}
		saveAs(await res.blob(), filename);
		return filename;
	}

	return errHandler(res);
};

methods.postForFile = async (url: string, params: any, file?: File) => {
	url = apiBaseUrl + url;

	const formData = new FormData();
	formData.append("params", JSON.stringify(params));
	if (file) formData.append("file", file);

	const options: RequestInit = {
		method: "POST",
		body: formData,
	};
	if (jwtBearerToken)
		options.headers = { Authorization: `Bearer ${jwtBearerToken}` };

	const res = await fetch(url, options);

	if (res.ok) {
		let filename = "download";
		const d = res.headers.get("content-disposition");
		if (d) {
			const m = d.match(/filename="(.*)"/i);
			if (m) filename = m[1];
		}
		saveAs(await res.blob(), filename);
		return filename;
	}

	return errHandler(res);
};

/** Deprecated */
methods.postMultipart = async (url: string, params: Record<string, any>) => {
	url = apiBaseUrl + url;

	let formData = new FormData();
	Object.entries(params).forEach(([key, value]) => {
		formData.append(key, value);
	});

	const options: RequestInit = {
		method: "POST",
		body: formData,
	};
	if (jwtBearerToken)
		options.headers = { Authorization: `Bearer ${jwtBearerToken}` };

	const res = await fetch(url, options);

	return res.ok ? res.json() : errHandler(res);
};

methods.postWithFile = async (url: string, params: any, file?: File) => {
	url = apiBaseUrl + url;

	const formData = new FormData();
	formData.append("params", JSON.stringify(params));
	if (file) formData.append("file", file);

	const options: RequestInit = {
		method: "POST",
		body: formData,
	};
	if (jwtBearerToken)
		options.headers = { Authorization: `Bearer ${jwtBearerToken}` };

	const res = await fetch(url, options);

	return res.ok ? res.json() : errHandler(res);
};

export default methods;
