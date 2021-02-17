import {IApiDefinition} from '../project';

export interface IWebApi extends IApiDefinition {
	type: 'web';
	kind: 'REST' | 'GRPC';
}
