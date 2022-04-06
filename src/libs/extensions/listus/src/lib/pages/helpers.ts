import { IListInfo } from '@sneat/dto';

export function getListUrlId(listInfo: IListInfo): string {
	console.log('getListUrlId', listInfo);
	if (!listInfo.id) {
		throw new Error('!listInfo.id');
	}
	return listInfo.id;
}
