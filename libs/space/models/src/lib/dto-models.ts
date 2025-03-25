import { SpaceType } from '@sneat/core';
import { IRecord } from '@sneat/data';
import { ISpaceDbo } from '@sneat/dto';

export interface ICreateSpaceRequest {
	type: SpaceType;
	// memberType: MemberType;
	title?: string;
}

export interface ICreateSpaceResponse {
	space: IRecord<ISpaceDbo>;
}
