import { IListInfo } from '@sneat/dto';

export function getListUrlId(listInfo: IListInfo): string {
  if (!listInfo.id) {
    throw new Error('!listInfo.id');
  }
  return listInfo.id;
}
