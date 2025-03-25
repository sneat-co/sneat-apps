import { IContactBrief, IContactDto } from '../dto';
import { ISpaceItemNavContext } from '@sneat/space-models';

export interface IContactContext
	extends ISpaceItemNavContext<IContactBrief, IContactDto> {
	parentContact?: IContactContext;
}
