import { Pipe, PipeTransform } from '@angular/core';
import { personNames } from '@sneat/auth-ui';
import { IIdAndOptionalBriefAndOptionalDbo } from '@sneat/core';
import { IContactBrief, IContactDbo } from '@sneat/contactus-core';

export function getContactTitle(
	m: IIdAndOptionalBriefAndOptionalDbo<IContactBrief, IContactDbo>,
	shortTitle?: string,
): string {
	return (
		shortTitle ||
		m?.brief?.title ||
		m?.dbo?.title ||
		personNames(m?.brief?.names) ||
		m?.id ||
		'MEMBER is UNDEFINED'
	);
}

@Pipe({
	name: 'contactTitle',
})
export class ContactTitlePipe implements PipeTransform {
	transform(
		m?: IIdAndOptionalBriefAndOptionalDbo<IContactBrief, IContactDbo>,
		shortTitle?: string,
	): string {
		return m ? getContactTitle(m, shortTitle) : '';
	}
}
