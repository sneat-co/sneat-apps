import { SelectedContactsPipe } from './selected-contacts.pipe';

describe('SelectedContactsPipe', () => {
	let pipe: SelectedContactsPipe;

	beforeEach(() => {
		pipe = new SelectedContactsPipe();
	});

	it('should create', () => {
		expect(pipe).toBeTruthy();
	});

	it('should return contacts with briefs for selected IDs', () => {
		const result = pipe.transform(['id1'], { id1: { title: 'Contact 1' } });
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('id1');
	});

	it('should return contacts without briefs when no briefs provided', () => {
		const result = pipe.transform(['id1']);
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('id1');
	});
});
