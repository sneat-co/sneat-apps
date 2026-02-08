import { firstValueFrom, of } from 'rxjs';
import { mapToRecord, MightHaveId, IRecord } from './record';

describe('record', () => {
	describe('mapToRecord', () => {
		it('should map a DTO to a record with default state', async () => {
			const dto: MightHaveId = { id: 'test-id' };
			const record: IRecord<MightHaveId> = await firstValueFrom(
				of(dto).pipe(mapToRecord()),
			);
			expect(record.id).toBe('test-id');
			expect(record.dbo).toBe(dto);
			expect(record.state).toBe('unchanged');
		});

		it('should map a DTO to a record with specified state', async () => {
			const dto: MightHaveId = { id: 'test-id' };
			const record: IRecord<MightHaveId> = await firstValueFrom(
				of(dto).pipe(mapToRecord('loading')),
			);
			expect(record.id).toBe('test-id');
			expect(record.dbo).toBe(dto);
			expect(record.state).toBe('loading');
		});
	});
});
