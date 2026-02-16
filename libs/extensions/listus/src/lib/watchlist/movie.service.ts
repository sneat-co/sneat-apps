import { Injectable } from '@angular/core';
// import { CommuneItemBaseService } from '../../../services/commune-item-base-service';
// import { MovieKind } from '../dto';
import { IMovieDbo } from '../dto';
import { Observable } from 'rxjs';
// import { IRxReadwriteTransaction } from 'rxstore';
// import { ISneatStoreProvider } from '../../../models/db-schemas-by-app/sneat-app-schema';
// import { ListusAppSchema } from '../../../models/db-schemas-by-app';
import { IMovieService } from './interfaces';

@Injectable({
  providedIn: 'root',
})
// extends CommuneItemBaseService<typeof MovieKind, IMovieDto, ListusAppSchema>
export class MovieService implements IMovieService {
  addCommuneItem(
    dto: IMovieDbo,
    // tx?: IRxReadwriteTransaction<ListusAppSchema>,
  ): Observable<IMovieDbo> {
// console.log('MovieService.addCommuneItem()', dto);
    throw new Error('Not implemented');
  }
}
