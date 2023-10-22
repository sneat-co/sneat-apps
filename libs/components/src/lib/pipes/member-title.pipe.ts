import { Pipe, PipeTransform } from '@angular/core';
import {
	IContactBrief,
	IContactDto,
	IIdAndOptionalBriefAndOptionalDto,
} from '@sneat/dto';
import { personName } from './person-title.pipe';

export function getContactTitle(
	m: IIdAndOptionalBriefAndOptionalDto<IContactBrief, IContactDto>,
	shortTitle?: string,
): string {
	return (
		shortTitle ||
		m?.brief?.title ||
		m?.dto?.title ||
		personName(m?.brief?.name) ||
		m?.id ||
		'MEMBER is UNDEFINED'
	);
}

@Pipe({ name: 'contactTitle' })
export class ContactTitlePipe implements PipeTransform {
	transform(
		m?: IIdAndOptionalBriefAndOptionalDto<IContactBrief, IContactDto>,
		shortTitle?: string,
	): string {
		return m ? getContactTitle(m, shortTitle) : '';
	}
}
