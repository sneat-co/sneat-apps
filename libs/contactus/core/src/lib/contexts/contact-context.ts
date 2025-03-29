import { IContactBrief, IContactDbo } from '../dto';
import { ISpaceItemNavContext } from '@sneat/space-models';

export interface IContactContext
	extends ISpaceItemNavContext<IContactBrief, IContactDbo> {
	parentContact?: IContactContext;
}
