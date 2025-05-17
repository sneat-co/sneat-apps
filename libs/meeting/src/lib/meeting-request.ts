import { ISpaceRequest } from '@sneat/space-models';

export interface IMeetingRequest extends ISpaceRequest {
	meeting: string;
}
