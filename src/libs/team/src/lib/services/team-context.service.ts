import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamContextService {

  private readonly $currentTeamId = new BehaviorSubject<string | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public currentTeamId = this.$currentTeamId.asObservable();

  constructor(
    // private teamService: TeamService,
  ) {
  }

  public trackUrl(route: ActivatedRoute, paramName: string): Observable<string> {
    return route.queryParamMap.pipe(
      map(params => this.setActiveTeamId(params.get(paramName))),
      tap(id => console.log('team ID:', id)),
    );
  }

  public setActiveTeamId(id: string): string {
    this.$currentTeamId.next(id);
    return id;
  }
}
