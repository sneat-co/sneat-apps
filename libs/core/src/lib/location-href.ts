
export function setHrefQueryParam(param: string, value: string, href = location.href): string {
	const url = new URL(href);
	url.searchParams.set(param, value);
	return url.href;
}
