import {IAuthStateRecord} from '../../auth/interfaces';
import {ITitledRecord} from './dto-models';
import {IRecord} from 'rxstore';

export interface DtoApp extends IRecord {
	users?: ITitledRecord[];
	currentLanguage?: string;
	authState?: IAuthStateRecord;
	isInDemoMode?: boolean;
}
