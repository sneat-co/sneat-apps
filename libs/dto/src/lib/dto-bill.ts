import { IDemoRecord, ITitledRecord, ITotalsHolder } from './dto-models';

export interface IBillDto extends ITitledRecord, IDemoRecord, ITotalsHolder {}
