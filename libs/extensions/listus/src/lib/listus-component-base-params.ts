import { Injectable, inject } from '@angular/core';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { ListService } from './services/list.service';

@Injectable()
export class ListusComponentBaseParams {
  readonly spaceParams = inject(SpaceComponentBaseParams);
  readonly listService = inject(ListService);
}
