import { Pipe, PipeTransform } from '@angular/core';
import { IMemberContext } from '@sneat/team/models';
import { personName } from './person-title.pipe';

export function getMemberTitle(m: IMemberContext, shortTitle?: string): string {
	return shortTitle || m?.brief?.title || m?.dto?.title || personName(m?.brief?.name) || m?.id || 'MEMBER is UNDEFINED';
}

@Pipe({ name: 'memberTitle' })
export class MemberTitle implements PipeTransform {
	transform(m?: IMemberContext, shortTitle?: string): string {
		return m ? getMemberTitle(m, shortTitle) : '';
	}
}
