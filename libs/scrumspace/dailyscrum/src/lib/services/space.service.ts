import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { ITeam, ITeamMetric } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class SpaceService {
  getTeam(spaceId: string): Observable<ITeam> {
    void spaceId;
    // console.log('SpaceService.getTeam', spaceId);
    return EMPTY;
  }

  addMetric(
    spaceId: string | null | undefined,
    metric: ITeamMetric,
  ): Observable<void> {
    void spaceId;
    void metric;
    // console.log('SpaceService.addMetric', spaceId, metric);
    return EMPTY;
  }
}
