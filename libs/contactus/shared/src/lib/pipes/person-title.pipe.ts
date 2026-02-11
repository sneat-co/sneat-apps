import { Pipe, PipeTransform } from '@angular/core';
import { personNames } from '@sneat/auth-ui';
import { IIdAndOptionalBriefAndOptionalDbo } from '@sneat/core';
import { IPerson, IPersonBrief } from '@sneat/contactus-core';

@Pipe({ name: 'personTitle' })
export class PersonTitle implements PipeTransform {
  transform(
    p?: IIdAndOptionalBriefAndOptionalDbo<IPersonBrief, IPerson>,
    shortTitle?: string,
  ): string {
    // console.log('PersonTitle.transform()', { ...p }, shortTitle);
    return (
      shortTitle ||
      p?.dbo?.title ||
      p?.brief?.title ||
      personNames(p?.brief?.names) ||
      p?.id ||
      'NO TITLE'
    );
  }
}
