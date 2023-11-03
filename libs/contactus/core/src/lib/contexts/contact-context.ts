import { IContactBrief, IContactDto } from '../dto';
import { ITeamItemNavContext } from '@sneat/team-models';

export interface IContactContext
	extends ITeamItemNavContext<IContactBrief, IContactDto> {
	parentContact?: IContactContext;
}
