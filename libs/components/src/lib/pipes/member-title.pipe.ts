import { Pipe, PipeTransform } from '@angular/core';
import { IIdAndOptionalBriefAndOptionalDto } from '@sneat/core';
import { IContactBrief, IContactDto } from '@sneat/contactus-core';
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
