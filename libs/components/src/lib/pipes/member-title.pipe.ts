import { Pipe, PipeTransform } from '@angular/core';
import { IIdAndOptionalBriefAndOptionalDbo } from '@sneat/core';
import { IContactBrief, IContactDto } from '@sneat/contactus-core';
import { personName } from './person-title.pipe';

export function getContactTitle(
	m: IIdAndOptionalBriefAndOptionalDbo<IContactBrief, IContactDto>,
	shortTitle?: string,
): string {
	return (
		shortTitle ||
		m?.brief?.title ||
		m?.dbo?.title ||
		personName(m?.brief?.names) ||
		m?.id ||
		'MEMBER is UNDEFINED'
	);
}

@Pipe({
	name: 'contactTitle',
})
export class ContactTitlePipe implements PipeTransform {
	transform(
		m?: IIdAndOptionalBriefAndOptionalDbo<IContactBrief, IContactDto>,
		shortTitle?: string,
	): string {
		return m ? getContactTitle(m, shortTitle) : '';
	}
}
